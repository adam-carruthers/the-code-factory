import ItemInTransit from "./itemInTransit";
import Workstation from "./workstation";

export type WorkstationMap = { [workspaceKey: string]: Workstation };
type SimElement = ItemInTransit | Workstation;

export const TRAVEL_TIME = 5000;

const linkPartIdNotInSet = (links: string[], validIds: Set<string>) =>
  links.some((link) =>
    link.split("-").some((linkPartId) => !validIds.has(linkPartId))
  );

export default class Simulation {
  workstationMap: WorkstationMap;
  itemsInTransit: { [link: string]: ItemInTransit[] };
  workstationToLink: { [workstationId: string]: string };
  nextEventTime: number;

  constructor(workstations: Workstation[], links: string[]) {
    if (links.some((link) => (link.match(/-/g) || []).length !== 1))
      throw new Error("Links must have one and exactly one dash symbol");

    const workstationIds = workstations.map((ws) => ws.id);

    if (
      workstationIds.indexOf("start") !== -1 ||
      workstationIds.indexOf("end") !== -1
    )
      throw new Error(
        "workstation ids must not contain the words 'start' or 'end'"
      );

    if (linkPartIdNotInSet(links, new Set([...workstationIds, "start", "end"])))
      throw new Error(
        "Link part must be in workstation ids or be 'start' or 'end'"
      );

    this.workstationToLink = Object.fromEntries(
      links.map((link) => [link.split("-")[0], link])
    );
    this.workstationMap = Object.fromEntries(
      workstations.map((ws) => [ws.id, ws])
    );
    this.itemsInTransit = Object.fromEntries(links.map((link) => [link, []]));
    this.updateNextEventTime();
  }

  updateNextEventTime = () => {
    // All elements + master dt must be in sync at this point
    this.nextEventTime = this.getNextSoonestEventTime();
  };

  getAllSimElements = (): SimElement[] => [
    ...Object.values(this.workstationMap),
    ...Object.values(this.itemsInTransit).flat(),
  ];

  getNextSoonestEventTime = () => {
    // All elements + master dt must be in sync at this point
    return Math.min(
      ...this.getAllSimElements().map((el) => el.getNextEventTime())
    );
  };

  addItemToLink = (link: string) => {
    // All elements + master dt must be in sync at this point
    const iit = new ItemInTransit(TRAVEL_TIME, link);
    this.itemsInTransit[link].push(iit);
    const iitNextEvtTime = iit.getNextEventTime();
    if (iitNextEvtTime < this.nextEventTime)
      this.nextEventTime = iitNextEvtTime;
  };

  addItemToWorkstation = (workstationId: string) => {
    // All elements + master dt must be in sync at this point
    this.workstationMap[workstationId].receiveItem();
    const wsNextEvtTime = this.workstationMap[workstationId].getNextEventTime();
    if (wsNextEvtTime < this.nextEventTime) this.nextEventTime = wsNextEvtTime;
  };

  #passEventlessTime = (dt: number) => {
    if (dt <= 0) throw new Error("dt <= 0");
    if (dt > this.nextEventTime)
      throw new Error("Tried to pass more time than the next event Simulation");
    this.getAllSimElements().forEach((el) => el.passTime(dt));
    this.nextEventTime -= dt;
  };

  passTime = (dt: number) => {
    if (this.nextEventTime <= 0)
      throw new Error(
        "Starting passTime in simulation with nextEventTime <= 0"
      );
    if (dt <= 0)
      throw new Error("Starting passTime in simulation with dt <= 0");
    if (dt < this.nextEventTime) return this.#passEventlessTime(dt);

    while (dt >= this.nextEventTime) {
      if (this.nextEventTime <= 0)
        throw new Error(
          "At start of simulation passTime loop nextEventTime <= 0"
        );
      if (dt <= 0)
        throw new Error("At start of simulation passTime loop dt <= 0");

      dt -= this.nextEventTime;
      this.#passEventlessTime(this.nextEventTime);

      this.performAllCurrentEvents();

      this.updateNextEventTime();
    }

    if (dt > 0) this.#passEventlessTime(dt);
  };

  performAllCurrentEvents = () => {
    this.getAllSimElements()
      .filter((em) => em.getNextEventTime() === 0)
      .map(this.performEventOnSimElement);
  };

  performEventOnSimElement = (el: SimElement) => {
    el.runEvent();
    if (el instanceof ItemInTransit) {
      if (!el.link) throw new Error("ItemInTransit missing link property");

      // Get it out of the list
      this.itemsInTransit[el.link] = this.itemsInTransit[el.link].filter(
        (iit) => iit !== el
      );

      const destWorkstationId = el.link.split("-")[1];

      if (destWorkstationId == "end") return;

      this.addItemToWorkstation(destWorkstationId);
    } else {
      const toLink = this.workstationToLink[el.id];

      this.addItemToLink(toLink);
    }
  };
}
