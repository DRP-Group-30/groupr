import React from "react";
import { MouseEvent } from "react";
import { db } from "./Firebase";
import {
  DocumentData,
  DocumentReference,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const OFFSET_THRESHOLD = 300;
const DEFAULT_USER_ID = "4yVmpEgdaQvizc3sNgas";

const Card = () => {
  const [offset, setOffset] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  let [cardData, setCardData] = React.useState<{
    ref: DocumentReference;
    name: string;
  } | null>(null);
  let [cards, setCards] = React.useState<DocumentReference[]>([]);

  if (cardData === null) nextCard();

  async function nextCard() {
    if (cards.length === 0) await pollCards();
    if (cards.length === 0) {
      setCardData((cardData = null));
      return;
    }
    const cardRef = cards[cards.length - 1];
    console.log(cards.length);
    cards.pop();
    const cardDoc = await getDoc(cardRef);
    setCardData((cardData = { ref: cardRef, name: cardDoc.get("Name") }));
  }

  async function pollCards() {
    const defaultUser = await getDoc(doc(db, "users", DEFAULT_USER_ID));
    const interested: DocumentReference[] = defaultUser.get("Interested");
    const matched: DocumentReference[] = defaultUser.get("Matched");
    const rejected: DocumentReference[] = defaultUser.get("Rejected");
    const seenBefore = interested
      .concat(matched)
      .concat(rejected)
      .map((r) => r.id);
    const cr = cardData?.ref;
    if (cr != null) {
      // Current card might not have been added to Firestore so we manually add
      // it to the 'seenBefore' list
      seenBefore.push(cr.id);
    }

    const ds = await getDocs(collection(db, "projects"));

    setCards(
      (cards = ds.docs
        .map((d) => d.ref)
        .filter((r) => !seenBefore.includes(r.id)))
    );
  }

  function dragStart(ev: MouseEvent<HTMLDivElement>) {
    setDragging(true);
    setOffset(ev.pageX - window.innerWidth / 2);
  }

  async function acceptCard() {
    const cr = cardData?.ref;
    if (cr === undefined) return;
    await updateField<DocumentReference[]>(
      doc(db, "users", DEFAULT_USER_ID),
      "Interested",
      (rs) => rs.concat([cr])
    );
  }

  async function rejectCard() {
    const cr = cardData?.ref;
    if (cr === undefined) return;
    await updateField<DocumentReference[]>(
      doc(db, "users", DEFAULT_USER_ID),
      "Rejected",
      (rs) => rs.concat([cr])
    );
  }

  async function dragEnd(ev: MouseEvent<HTMLDivElement>) {
    setDragging(false);

    if (Math.abs(offset) >= OFFSET_THRESHOLD) {
      if (offset > 0) {
        acceptCard();
      } else {
        rejectCard();
      }
      // In an ideal world, we would have the card that flies up be a separate
      // card, given the same state as the current one
      nextCard();
    }

    setOffset(0);
  }

  function dragMove(ev: MouseEvent<HTMLDivElement>) {
    if (!dragging) return;

    setOffset(ev.pageX - window.innerWidth / 2);
  }

  return (
    <div>
      <div
        className={`Card ${dragging ? "" : "Released"}`}
        onMouseDown={dragStart}
        onMouseUp={dragEnd}
        onMouseMove={dragMove}
        onMouseLeave={dragEnd}
        style={{
          transform: `translate(${offset}px, 0) rotate(${offset / 10}deg)`,
        }}
      >
        <h1>{cardData?.name ?? "Out of Cards :("}</h1>
      </div>
    </div>
  );
};

export default Card;

export function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

export function inlineLog<T>(x: T): T {
  console.log(x);
  return x;
}

const updateField = <T,>(
  d: DocumentReference<DocumentData>,
  f: string,
  m: (x: T) => T
): Promise<void> =>
  getDoc(d)
    .then((snapshot) => snapshot.get(f))
    .then((n: T) => updateDoc(d, { [f]: m(n) }));
