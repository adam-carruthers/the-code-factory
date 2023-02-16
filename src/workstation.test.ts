import { expect, test, jest } from "@jest/globals";
import Workstation from "./workstation";

test("shows null for next event time without ongoing jobs", () => {
  const ws = new Workstation(10);

  expect(ws.getNextEventTime()).toBe(null);
});

test("allows infinite passing of time without ongoing job", () => {
  const ws = new Workstation(10);

  ws.passTime(1000000000);
});

test("counts time during simple job", () => {
  const ws = new Workstation(10);

  ws.receiveItem();

  expect(ws.getNextEventTime()).toEqual(10);

  ws.passTime(6);

  expect(ws.getNextEventTime()).toEqual(4);

  ws.passTime(4);

  expect(ws.getNextEventTime()).toEqual(0);
});

test("doesn't allow passing too much time", () => {
  const ws = new Workstation(3);

  ws.receiveItem();

  expect(() => ws.passTime(3.001)).toThrowError(
    "ItemInTransit was asked to pass time longer than the time left in transit"
  );
});

test("receiving item with nothing going on goes into wait list", () => {
  const ws = new Workstation(3);

  ws.receiveItem();

  expect(ws.waitListCount).toEqual(0);
});

test("doesn't allow running event without ongoing job", () => {
  const ws = new Workstation(3);

  expect(() => ws.runEvent()).toThrowError(
    "Tried to run event in workstation without an ongoing job."
  );
});

test("doesn't allow running event with time remaining", () => {
  const ws = new Workstation(3);

  ws.receiveItem();

  expect(() => ws.runEvent()).toThrowError(
    "Tried to run event in workstation when time left was not 0"
  );
});

test("end event after the correct amount of time has passed", () => {
  const ws = new Workstation(6);

  ws.receiveItem();

  ws.passTime(3);
  ws.passTime(3);

  ws.runEvent();

  expect(ws.getNextEventTime()).toBe(null);
});

test("pass over to next item in wait list", () => {
  const ws = new Workstation(6);

  ws.receiveItem();

  ws.passTime(3);

  ws.receiveItem();

  ws.passTime(3);

  ws.runEvent();

  expect(ws.getNextEventTime()).toEqual(6);
  expect(ws.waitListCount).toEqual(0);

  ws.passTime(6);
  ws.runEvent();

  expect(ws.getNextEventTime()).toEqual(null);
});

test("counts wait list correctly", () => {
  const ws = new Workstation(6);

  ws.receiveItem();
  ws.receiveItem();
  ws.receiveItem();

  expect(ws.waitListCount).toEqual(2);
});
