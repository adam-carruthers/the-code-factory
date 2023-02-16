import { expect, test, jest } from "@jest/globals";
import ItemInTransit from "./itemInTransit";

test("passes time", () => {
  const iit = new ItemInTransit(100);

  expect(iit.getNextEventTime()).toEqual(100);

  iit.passTime(10);

  expect(iit.getNextEventTime()).toEqual(90);

  iit.passTime(20);

  expect(iit.getNextEventTime()).toEqual(70);
});

test("errors on passing too much time", () => {
  const iit = new ItemInTransit(10);

  iit.passTime(5);
  expect(() => iit.passTime(5.01)).toThrowError(
    "ItemInTransit was asked to pass time longer than the time left in transit"
  );
});

test("doesn't error on passing exactly the right amount of time", () => {
  const iit = new ItemInTransit(35);

  iit.passTime(35);

  expect(iit.getNextEventTime()).toEqual(0);
});

test("runEvent only executes at the correct time", () => {
  const iit = new ItemInTransit(100);

  expect(() => iit.runEvent()).toThrowError(
    "Event was run when the time left was not 0 (it was 100)"
  );

  iit.passTime(100);

  iit.runEvent();
});
