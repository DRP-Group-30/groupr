import { rejects } from "assert";
import React from "react";
import { MouseEvent } from "react";
import { db } from "./Firebase";
import {
  DocumentReference,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

const OFFSET_THRESHOLD = 300;
const DEFAULT_USER_ID = "4yVmpEgdaQvizc3sNgas";

const Card = () => {
  const [offset, setOffset] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [name, setName] = React.useState("");
  let [cards, setCards] = React.useState<string[]>([]);
  if (name === "") nextCard();

  async function nextCard() {
    if (cards.length === 0) await pollCards();
    setName(inlineLog(cards[cards.length - 1]));
    cards.pop();
  }
  async function pollCards() {
    const defaultUser = await getDoc(doc(db, "users", DEFAULT_USER_ID));
    const interested: DocumentReference[] = defaultUser.get("Interested");
    const matched: DocumentReference[] = defaultUser.get("Matched");
    const rejected: DocumentReference[] = defaultUser.get("Rejected");
    const seenBefore = interested.concat(matched).concat(rejected);
    const ds = await getDocs(collection(db, "projects"));

    cards = ds.docs
      .filter((d) => seenBefore.find((r) => r === d.ref) === undefined)
      .map((n) => n.get("Name"));
    setCards(cards);
  }

  function dragStart(ev: MouseEvent<HTMLDivElement>) {
    setDragging(true);
    setOffset(ev.pageX - window.innerWidth / 2);
  }

  function acceptCard() {
    console.log("Accept");
  }

  function rejectCard() {
    console.log("Reject");
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
        <h1>{name}</h1>
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
