import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { Popup } from "./Popup";

beforeEach(jest.useFakeTimers);

it("does timing things", async () => {
  const timeout = 100;
  const mock = jest.fn();

  render(<Popup timeout={100} onClose={mock} />);

  // act(() => {
  //   jest.runAllTimers();
  //   // jest.advanceTimersByTime(timeout + 10000);
  // });

  // expect(mock).toHaveBeenCalled();
  fireEvent.transitionEnd(screen.getByRole("alert"));
  expect(mock).toHaveBeenCalled();
  // await waitFor(() => expect(mock).toHaveBeenCalled());
});
