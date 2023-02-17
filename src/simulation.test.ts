import { expect, jest, test } from "@jest/globals";
import Simulation, { TRAVEL_TIME } from "./simulation";
import Workstation from "./workstation";

test("can't be created with invalid link def", () => {
  expect(() => new Simulation([], ["startend"])).toThrowError(
    "Links must have one and exactly one dash symbol"
  );
  expect(() => new Simulation([], ["start--end"])).toThrowError(
    "Links must have one and exactly one dash symbol"
  );
});

test("can't be created with start and end as workstation IDs", () => {
  expect(() => new Simulation([new Workstation(5, "start")], [])).toThrowError(
    "workstation ids must not contain the words 'start' or 'end'"
  );
  expect(() => new Simulation([new Workstation(5, "end")], [])).toThrowError(
    "workstation ids must not contain the words 'start' or 'end'"
  );
});

test("can't be created with link IDs not in accepted list", () => {
  expect(() => new Simulation([new Workstation(5, "start")], [])).toThrowError(
    "workstation ids must not contain the words 'start' or 'end'"
  );
  expect(() => new Simulation([new Workstation(5, "end")], [])).toThrowError(
    "workstation ids must not contain the words 'start' or 'end'"
  );
});

test("can be created with link IDs of start and end", () => {
  new Simulation([], ["start-end"]);
});

test("workstationToLink init", () => {
  const sim = new Simulation(
    [new Workstation(5, "ws1"), new Workstation(5, "ws2")],
    ["start-ws1", "ws1-ws2", "ws2-end"]
  );

  expect(sim.workstationToLink).toEqual({
    start: "start-ws1",
    ws1: "ws1-ws2",
    ws2: "ws2-end",
  });
});

test("itemsInTransit init", () => {
  const sim = new Simulation(
    [new Workstation(5, "ws1"), new Workstation(5, "ws2")],
    ["start-ws1", "ws1-ws2", "ws2-end"]
  );

  expect(sim.itemsInTransit).toEqual({
    "start-ws1": [],
    "ws1-ws2": [],
    "ws2-end": [],
  });
});

test("track one item through no workstation system", () => {
  const sim = new Simulation([], ["start-end"]);

  sim.passTime(1000);
  expect(sim.nextEventTime).toEqual(Infinity);

  sim.addItemToLink("start-end");

  expect(sim.itemsInTransit["start-end"].length).toEqual(1);
  expect(sim.itemsInTransit["start-end"][0].timeLeft).toEqual(TRAVEL_TIME);
  expect(sim.nextEventTime).toEqual(TRAVEL_TIME);

  sim.passTime(TRAVEL_TIME / 2);

  expect(sim.itemsInTransit["start-end"].length).toEqual(1);
  expect(sim.itemsInTransit["start-end"][0].timeLeft).toEqual(TRAVEL_TIME / 2);
  expect(sim.nextEventTime).toEqual(TRAVEL_TIME / 2);

  sim.passTime(TRAVEL_TIME);

  expect(sim.itemsInTransit["start-end"].length).toEqual(0);
  expect(sim.nextEventTime).toEqual(Infinity);
});

test("track two items through no workstation system, stopping exactly on event", () => {
  const sim = new Simulation([], ["start-end"]);

  sim.addItemToLink("start-end");

  sim.passTime(TRAVEL_TIME * (3 / 4));
  sim.addItemToLink("start-end");

  expect(sim.itemsInTransit["start-end"].length).toEqual(2);
  expect(sim.itemsInTransit["start-end"][1].timeLeft).toEqual(TRAVEL_TIME);
  expect(sim.nextEventTime).toEqual(TRAVEL_TIME / 4);

  sim.passTime(TRAVEL_TIME / 4);

  expect(sim.itemsInTransit["start-end"].length).toEqual(1);
  expect(sim.itemsInTransit["start-end"][0].timeLeft).toEqual(
    TRAVEL_TIME * (3 / 4)
  );
  expect(sim.nextEventTime).toEqual(TRAVEL_TIME * (3 / 4));
});

test("track two items through no workstation system, stopping after event", () => {
  const sim = new Simulation([], ["start-end"]);

  sim.addItemToLink("start-end");

  sim.passTime(TRAVEL_TIME * (3 / 4));
  sim.addItemToLink("start-end");

  expect(sim.itemsInTransit["start-end"].length).toEqual(2);
  expect(sim.itemsInTransit["start-end"][1].timeLeft).toEqual(TRAVEL_TIME);
  expect(sim.nextEventTime).toEqual(TRAVEL_TIME / 4);

  sim.passTime(TRAVEL_TIME / 2);

  expect(sim.itemsInTransit["start-end"].length).toEqual(1);
  expect(sim.itemsInTransit["start-end"][0].timeLeft).toEqual(TRAVEL_TIME / 2);
  expect(sim.nextEventTime).toEqual(TRAVEL_TIME / 2);
});

test("track one items through one workstation system, stopping exactly on boundaries", () => {
  const ws1 = new Workstation(TRAVEL_TIME * 2, "ws1");
  const sim = new Simulation([ws1], ["start-ws1", "ws1-end"]);

  sim.addItemToLink("start-ws1");
  sim.passTime(TRAVEL_TIME);

  expect(sim.itemsInTransit["start-ws1"].length).toEqual(0);
  expect(ws1.getNextEventTime()).toEqual(TRAVEL_TIME * 2);

  sim.passTime(0.5 * TRAVEL_TIME);
  sim.passTime(1.5 * TRAVEL_TIME);

  expect(ws1.getNextEventTime()).toEqual(Infinity);
  expect(sim.itemsInTransit["ws1-end"].length).toEqual(1);
});

test("track one items through one workstation system, stopping between boundaries", () => {
  const ws1 = new Workstation(TRAVEL_TIME * 2, "ws1");
  const sim = new Simulation([ws1], ["start-ws1", "ws1-end"]);

  sim.addItemToLink("start-ws1");
  sim.passTime(1.5 * TRAVEL_TIME);

  expect(sim.itemsInTransit["start-ws1"].length).toEqual(0);
  expect(ws1.getNextEventTime()).toEqual(TRAVEL_TIME * 1.5);

  sim.passTime(2 * TRAVEL_TIME);

  expect(ws1.getNextEventTime()).toEqual(Infinity);
  expect(sim.itemsInTransit["ws1-end"][0].getNextEventTime()).toEqual(
    TRAVEL_TIME / 2
  );
});
