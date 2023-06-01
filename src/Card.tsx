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

const PROJECTS = "projects";
const USERS = "users";
const OFFSET_THRESHOLD = 300;

const DEFAULT_USER_ID = "4yVmpEgdaQvizc3sNgas";
const DEFAULT_USER = doc(db, USERS, DEFAULT_USER_ID);

const INTERESTED = "Interested";
const MATCHED = "Matched";
const REJECTED = "Rejected";

const NAME = "Name";

const USER_CARD_CATEGORIES = [INTERESTED, MATCHED, REJECTED];

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
    setCardData((cardData = { ref: cardRef, name: cardDoc.get(NAME) }));
  }

  async function pollCards() {
    const defaultUser = await getDoc(DEFAULT_USER);
    const seenBefore = USER_CARD_CATEGORIES.flatMap<DocumentReference>((d) =>
      defaultUser.get(d)
    ).map((r) => r.id);
    const id = cardData?.ref?.id;
    // Current card might not have been added to Firestore so we manually add
    // it to the 'seenBefore' list
    if (id !== undefined) seenBefore.push(id);

    const ds = await getDocs(collection(db, PROJECTS));

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
    await updateField<DocumentReference[]>(DEFAULT_USER, INTERESTED, (rs) =>
      rs.concat([cr])
    );
  }

  async function rejectCard() {
    const cr = cardData?.ref;
    if (cr === undefined) return;
    await updateField<DocumentReference[]>(DEFAULT_USER, REJECTED, (rs) =>
      rs.concat([cr])
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

  async function resetCards() {
    updateFields(
      DEFAULT_USER,
      USER_CARD_CATEGORIES.map((c) => [c, () => []])
    );
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
      <button onClick={resetCards}>Reset Database</button>
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

const updateFields = (
  d: DocumentReference<DocumentData>,
  fs: [string, (x: any) => any][]
): Promise<void> =>
  getDoc(d)
    .then((snapshot) => fs.map(([f, _]) => snapshot.get(f)))
    .then((n) =>
      updateDoc(d, Object.fromEntries(fs.map(([f, m], i) => [f, m(n[i])])))
    );
