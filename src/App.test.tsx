import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "./Firebase";
import { DEFAULT_USER_ID, USERS } from "./Card";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test(`connect to firestore successfully`, async () => {
  const snapshot = await getDoc(doc(db, USERS, DEFAULT_USER_ID));
  expect(snapshot.get("Name")).toBe("DefaultUser");
});
