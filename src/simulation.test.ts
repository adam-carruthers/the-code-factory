import { expect, jest, test } from "@jest/globals";
import Pipe from "./pipe";
import Simulation from "./simulation";
import Workstation from "./workstation";

test("track one item through no workstation system", () => {
  const endCb = jest.fn();
  const sim = new Simulation([], [new Pipe("start-end", 4, null, null)]);
  sim.pipeById["start-end"].registerCreateCb(() => endCb);

  sim.passTime(1000);
  expect(sim.nextEventTime).toEqual(Infinity);

  sim.addItemToPipe("start-end");
  expect(sim.nextEventTime).toEqual(4);
  sim.passTime(2);
  expect(sim.nextEventTime).toEqual(2);
  expect(endCb).toBeCalledTimes(0);
  sim.passTime(4);
  expect(sim.nextEventTime).toEqual(Infinity);
  expect(endCb).toBeCalledTimes(1);
});

test("track two items through no workstation system, stopping exactly on event", () => {
  const sim = new Simulation([], [new Pipe("start-end", 4, null, null)]);

  sim.addItemToPipe("start-end");
  sim.passTime(3);
  sim.addItemToPipe("start-end");
  expect(sim.nextEventTime).toEqual(1);
  sim.passTime(1);
  expect(sim.nextEventTime).toEqual(3);
});

test("track one items through one workstation system, stopping exactly on boundaries", () => {
  const ws1 = new Workstation(2, "ws1");
  const sim = new Simulation(
    [ws1],
    [new Pipe("start-ws1", 5, null, "ws1"), new Pipe("ws1-end", 6, "ws1", null)]
  );

  sim.addItemToPipe("start-ws1");
  sim.passTime(5);

  expect(sim.pipeById["start-ws1"].getNextEventTime()).toEqual(Infinity);
  expect(ws1.getNextEventTime()).toEqual(2);
  expect(sim.nextEventTime).toEqual(2);

  sim.passTime(0.5);
  sim.passTime(1.5);

  expect(ws1.getNextEventTime()).toEqual(Infinity);
  expect(sim.pipeById["ws1-end"].getNextEventTime()).toEqual(6);
  expect(sim.nextEventTime).toEqual(6);
});

test("track one item through one workstation system, stopping between boundaries", () => {
  const ws1 = new Workstation(2, "ws1");
  const sim = new Simulation(
    [ws1],
    [new Pipe("start-ws1", 5, null, "ws1"), new Pipe("ws1-end", 6, "ws1", null)]
  );

  sim.addItemToPipe("start-ws1");
  sim.passTime(5.5);

  expect(sim.pipeById["start-ws1"].getNextEventTime()).toEqual(Infinity);
  expect(ws1.getNextEventTime()).toEqual(1.5);

  sim.passTime(2);

  expect(ws1.getNextEventTime()).toEqual(Infinity);
  expect(sim.pipeById["ws1-end"].getNextEventTime()).toEqual(5.5);
});

test("track multiple items through one workstation system", () => {
  const ws1 = new Workstation(5, "ws1");
  const sim = new Simulation(
    [ws1],
    [
      new Pipe("start-ws1", 10, null, "ws1"),
      new Pipe("ws1-end", 6, "ws1", null),
    ]
  );

  sim.addItemToPipe("start-ws1");
  sim.addItemToPipe("start-ws1");
  sim.passTime(2.5);
  sim.addItemToPipe("start-ws1");
  sim.passTime(2.5);
  sim.addItemToPipe("start-ws1");

  sim.passTime(10);

  expect(sim.pipeById["start-ws1"].getNextEventTime()).toEqual(Infinity);
  expect(ws1.getNextEventTime()).toEqual(5);
  expect(ws1.waitListCount).toEqual(2);

  sim.passTime(5 + 5 + 0.5);

  expect(sim.pipeById["ws1-end"].itemInTransitMetas.length).toEqual(2);
  expect(ws1.waitListCount).toEqual(0);
});
