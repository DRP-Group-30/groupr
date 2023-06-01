import { rejects } from "assert";
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
import { readSync } from "fs";

const OFFSET_THRESHOLD = 300;
const DEFAULT_USER_ID = "4yVmpEgdaQvizc3sNgas";

const Card = () => {
  const [offset, setOffset] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  let [cardRef, setCardRef] = React.useState<DocumentReference | null>(null);
  let [cardData, setCardData] = React.useState<{ cardName: string } | null>(
    null
  );
  let [cards, setCards] = React.useState<DocumentReference[]>([]);

  if (cardRef === null) nextCard();
  async function nextCard() {
    if (cards.length === 0) await pollCards();
    if (cards.length === 0) return;
    cardRef = cards[cards.length - 1];
    cards.pop();
    setCardRef(cardRef);
    const cardDoc = await getDoc(cardRef);
    cardData = { cardName: cardDoc.get("Name") };
    setCardData(cardData);
  }
  async function pollCards() {
    const defaultUser = await getDoc(doc(db, "users", DEFAULT_USER_ID));
    const interested: DocumentReference[] = defaultUser.get("Interested");
    const matched: DocumentReference[] = defaultUser.get("Matched");
    const rejected: DocumentReference[] = defaultUser.get("Rejected");
    const seenBefore = interested.concat(matched).concat(rejected);
    const ds = await getDocs(collection(db, "projects"));
    cards = ds.docs
      .map((d) => d.ref)
      .filter((r0) => seenBefore.find((r1) => r0.id === r1.id) === undefined);

    setCards(cards);
  }

  function dragStart(ev: MouseEvent<HTMLDivElement>) {
    setDragging(true);
    setOffset(ev.pageX - window.innerWidth / 2);
  }

  async function acceptCard() {
    const cr = cardRef;
    if (cr === null) return;
    await updateField<DocumentReference[]>(
      doc(db, "users", DEFAULT_USER_ID),
      "Interested",
      (rs) => rs.concat([cr])
    );
  }

  async function rejectCard() {
    const cr = cardRef;
    if (cr === null) return;
    await updateField<DocumentReference[]>(
      doc(db, "users", DEFAULT_USER_ID),
      "Rejected",
      (rs) => rs.concat([cr])
    );
  }

  async function dragEnd(ev: MouseEvent<HTMLDivElement>) {
    setDragging(false);
    if (offset > OFFSET_THRESHOLD) {
    } else if (offset < -OFFSET_THRESHOLD) {
    } else {
    }

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
        <h1>{cardData?.cardName ?? "Out of Cards :("}</h1>
      </div>
    </div>
  );
};

export default Card;

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

function inlineLog<T>(x: T): T {
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
