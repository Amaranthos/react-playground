import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

it("displays a title", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: "Welcome to React Parcel Micro App!" })
  ).toBeVisible();
});
