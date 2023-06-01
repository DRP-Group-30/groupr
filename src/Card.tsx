import React from "react";
import { MouseEvent } from "react";

const Card = () => {
  const [offset, setOffset] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);

  function dragStart(ev: MouseEvent<HTMLDivElement>) {
    setDragging(true);
    setOffset(ev.pageX - window.innerWidth / 2);
  }

  function dragEnd(ev: MouseEvent<HTMLDivElement>) {
    setDragging(false);
    setOffset(0);
  }

  function dragMove(ev: MouseEvent<HTMLDivElement>) {
    if (!dragging) return;

    setOffset(ev.pageX - window.innerWidth / 2);
  }

  return (
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
      <h1>Nathaniel B's Gremlins</h1>
    </div>
  );
};

export default Card;
