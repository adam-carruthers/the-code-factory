import { expect, test, jest } from "@jest/globals";
import ItemInTransit from "./itemInTransit";

test("passes time", () => {
  const iit = new ItemInTransit(100, jest.fn(), jest.fn());

  expect(iit.getNextEventTime()).toEqual(100);

  iit.passTime(10);

  expect(iit.getNextEventTime()).toEqual(90);

  iit.passTime(20);

  expect(iit.getNextEventTime()).toEqual(70);
});

test("errors on passing too much time", () => {
  const iit = new ItemInTransit(10, jest.fn(), jest.fn());

  iit.passTime(5);
  expect(() => iit.passTime(5.01)).toThrowError(
    "ItemInTransit was asked to pass time longer than the time left in transit"
  );
});

test("doesn't error on passing exactly the right amount of time", () => {
  const iit = new ItemInTransit(35, jest.fn(), jest.fn());

  iit.passTime(35);

  expect(iit.getNextEventTime()).toEqual(0);
});

test("update function is called with correct values", () => {
  const updateMock = jest.fn();

  const iit = new ItemInTransit(100, updateMock, jest.fn());

  iit.updateGraphics();

  expect(updateMock).toBeCalledTimes(1);
  expect(updateMock).toBeCalledWith(100, 100);
  updateMock.mockReset();

  iit.passTime(10);
  iit.updateGraphics();

  expect(updateMock).toBeCalledTimes(1);
  expect(updateMock).toBeCalledWith(90, 100);
  updateMock.mockReset();
});

test("runEvent only executes at the correct time", () => {
  const endMock = jest.fn();

  const iit = new ItemInTransit(100, jest.fn(), endMock);

  expect(() => iit.runEvent()).toThrowError(
    "Event was run when the time left was not 0 (it was 100)"
  );

  iit.passTime(100);

  iit.runEvent();

  expect(endMock).toBeCalledTimes(1);
});
