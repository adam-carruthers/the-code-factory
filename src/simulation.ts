import ItemInTransit from "./itemInTransit";
import Pipe from "./pipe";
import Workstation from "./workstation";

type SimElement = Pipe | Workstation;

export default class Simulation {
  workstationById: { [workspaceKey: string]: Workstation };
  pipeById: { [pipeId: string]: Pipe };
  pipeBySourceWorkspaceId: { [workspaceId: string]: Pipe };
  nextEventTime: number;
  simElements: SimElement[];

  constructor(workstations: Workstation[], pipes: Pipe[]) {
    this.workstationById = Object.fromEntries(
      workstations.map((ws) => [ws.id, ws])
    );
    this.pipeById = Object.fromEntries(pipes.map((pipe) => [pipe.id, pipe]));
    this.pipeBySourceWorkspaceId = Object.fromEntries(
      pipes
        .filter((pipe) => pipe.fromWorkspaceId !== null)
        .map((pipe) => [pipe.fromWorkspaceId, pipe])
    );
    this.simElements = [...workstations, ...pipes];
    this.updateNextEventTime();
  }

  updateNextEventTime = () => {
    // All elements + master dt must be in sync at this point
    this.nextEventTime = this.calcNextEventTime();
  };

  calcNextEventTime = () => {
    // All elements + master dt must be in sync at this point
    return Math.min(...this.simElements.map((el) => el.getNextEventTime()));
  };

  addItemToPipe = (pipeId: string) => {
    // All elements + master dt must be in sync at this point
    this.pipeById[pipeId].addItem();
    const pipeNextEventTime = this.pipeById[pipeId].getNextEventTime();
    if (pipeNextEventTime < this.nextEventTime)
      this.nextEventTime = pipeNextEventTime;
  };

  addItemToWorkstation = (workstationId: string) => {
    // All elements + master dt must be in sync at this point
    this.workstationById[workstationId].receiveItem();
    const wsNextEvtTime =
      this.workstationById[workstationId].getNextEventTime();
    if (wsNextEvtTime < this.nextEventTime) this.nextEventTime = wsNextEvtTime;
  };

  #passEventlessTime = (dt: number) => {
    if (dt === 0) return;
    if (dt < 0) throw new Error("dt < 0");
    if (dt > this.nextEventTime)
      throw new Error("Tried to pass more time than the next event Simulation");
    this.simElements.forEach((el) => el.passTime(dt));
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
      dt -= this.nextEventTime;
      this.#passEventlessTime(this.nextEventTime);

      this.performAllCurrentEvents();

      this.updateNextEventTime();
    }

    this.#passEventlessTime(dt);
  };

  performAllCurrentEvents = () => {
    this.simElements
      .filter((em) => em.getNextEventTime() === 0)
      .map(this.performEventOnSimElement);
  };

  performEventOnSimElement = (el: SimElement) => {
    if (el instanceof Pipe) {
      el.runItemLeavesPipeEvent();

      if (el.toWorkspaceId === null) return;

      this.addItemToWorkstation(el.toWorkspaceId);
    } else {
      el.runItemFinishesProcesssingEvent();

      const toPipe = this.pipeBySourceWorkspaceId[el.id];

      this.addItemToPipe(toPipe.id);
    }
  };
}
