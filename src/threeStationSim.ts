import { Application, Container } from "pixi.js";
import Pipe from "./pipe";
import PipeUI from "./pipeUI";
import Simulation from "./simulation";
import MyTicker from "./ticker";
import Workstation from "./workstation";
import WorkstationUI from "./workstationUi";

export default function createThreeStationSim(
  app: Application,
  parent: Container
) {
  const myTicker = new MyTicker();

  const pipe1 = new Pipe("start-ws1", 200, null, "ws1");
  const pipeUi1 = new PipeUI(
    pipe1,
    { x: -150, y: 0 },
    { x: 250, y: 0 },
    myTicker,
    parent
  );

  const pipe2 = new Pipe("ws1-ws2", 100, "ws1", "ws2");
  const pipeUi2 = new PipeUI(
    pipe2,
    { x: 350, y: 0 },
    { x: 550, y: 0 },
    myTicker,
    parent
  );

  const pipe3 = new Pipe("ws2-ws3", 100, "ws2", "ws3");
  const pipeUi3 = new PipeUI(
    pipe3,
    { x: 650, y: 0 },
    { x: 850, y: 0 },
    myTicker,
    parent
  );

  const pipe4 = new Pipe("ws3-end", 200, "ws3", null);
  const pipeUi4 = new PipeUI(
    pipe4,
    { x: 950, y: 0 },
    { x: 1350, y: 0 },
    myTicker,
    parent
  );

  const ws = new Workstation(60, "ws1");
  const wsUi = new WorkstationUI(ws, { x: 250, y: 0 }, parent, myTicker);

  const ws2 = new Workstation(80, "ws2");
  const wsUi2 = new WorkstationUI(ws2, { x: 550, y: 0 }, parent, myTicker);

  const ws3 = new Workstation(80, "ws3");
  const wsUi3 = new WorkstationUI(ws3, { x: 850, y: 0 }, parent, myTicker);

  const sim = new Simulation([ws, ws2, ws3], [pipe1, pipe2, pipe3, pipe4]);

  let elapsed = 0;
  app.ticker.add((dt) => {
    elapsed += dt;
    if (elapsed > 50) {
      elapsed = 0;
      sim.addItemToPipe("start-ws1");
    }

    sim.passTime(dt);

    myTicker.callAllCallbacks(dt);
  });
}
