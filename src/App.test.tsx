import { render, screen } from "@testing-library/react";
import { getDoc } from "@firebase/firestore";
import { DEFAULT_USER } from "./Finder";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

test("renders dashboard link", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/dashboard/i);
  expect(linkElement).toBeInTheDocument();
});
