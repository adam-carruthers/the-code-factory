import { expect, jest, test } from "@jest/globals";
import Pipe from "./pipe";

test("time left is correct with nothing in pipe", () => {
  const pipe = new Pipe("test", 5, null, null);

  expect(pipe.getNextEventTime()).toEqual(Infinity);
});

test("can pass time with one item in pipe", () => {
  const pipe = new Pipe("test", 5, null, null);

  pipe.addItem();

  expect(pipe.getNextEventTime()).toEqual(5);

  pipe.passTime(3);

  expect(pipe.getNextEventTime()).toEqual(2);
});

test("when item added to pipe correct callback called", () => {
  const endCb = () => undefined;
  const addCb = jest.fn(() => endCb);

  const pipe = new Pipe("test", 5, null, null);
  pipe.registerCreateCb(addCb);

  pipe.addItem();

  expect(addCb).toBeCalledTimes(1);
  expect(addCb).toBeCalledWith(pipe.itemInTransitMetas[0].iit);

  expect(pipe.itemInTransitMetas[0].destroyCb).toBe(endCb);
});

test("does item leaves pipe event", () => {
  const endCb = jest.fn();
  const startCb = () => endCb;

  const pipe = new Pipe("test", 6, null, null);
  pipe.registerCreateCb(startCb);

  pipe.addItem();

  pipe.passTime(3);
  pipe.passTime(3);

  expect(pipe.getNextEventTime()).toEqual(0);

  pipe.runItemLeavesPipeEvent();

  expect(pipe.itemInTransitMetas.length).toEqual(0);

  expect(endCb).toBeCalledTimes(1);
});

test("handles two staggered items", () => {
  const pipe = new Pipe("test", 10, null, null);

  pipe.addItem();

  pipe.passTime(2);

  pipe.addItem();

  expect(pipe.itemInTransitMetas.length).toEqual(2);
  expect(pipe.getNextEventTime()).toEqual(8);

  pipe.passTime(8);
  pipe.runItemLeavesPipeEvent();

  expect(pipe.itemInTransitMetas.length).toEqual(1);
  expect(pipe.getNextEventTime()).toEqual(2);
});

test("handles two concurrent items", () => {
  const pipe = new Pipe("test", 10, null, null);

  pipe.addItem();
  pipe.addItem();

  expect(pipe.itemInTransitMetas.length).toEqual(2);
  expect(pipe.getNextEventTime()).toEqual(10);

  pipe.passTime(10);
  pipe.runItemLeavesPipeEvent();

  expect(pipe.itemInTransitMetas.length).toEqual(1);
  expect(pipe.getNextEventTime()).toEqual(0);

  pipe.runItemLeavesPipeEvent();

  expect(pipe.itemInTransitMetas.length).toEqual(0);
  expect(pipe.getNextEventTime()).toEqual(Infinity);
});
