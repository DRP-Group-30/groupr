import { render, screen } from "@testing-library/react";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import React from "react";

test("renders dashboard link", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
