import { Application, Container } from "pixi.js";
import Pipe from "./pipe";
import PipeUI from "./pipeUI";
import Simulation from "./simulation";
import Workstation from "./workstation";
import WorkstationUI from "./workstationUi";

(async () => {
  const app = new Application({ background: "#6ee0fa" });

  document
    .getElementById("constrained-capacity-container")
    // @ts-ignore
    ?.appendChild(app.view);

  const container = new Container();
  container.scale.x = 0.3;
  container.scale.y = 0.3;
  app.stage.addChild(container);

  const ws = new Workstation(50, "ws1");
  const wsUi = new WorkstationUI(ws, { x: 800, y: 0 }, container, app.ticker);

  const pipe1 = new Pipe("start-ws1", 100, null, "ws1");
  const pipeUi1 = new PipeUI(
    pipe1,
    { x: 0, y: 0 },
    { x: 800, y: 0 },
    app.ticker,
    container
  );

  const pipe2 = new Pipe("ws1-end", 100, "ws1", null);
  const pipeUi2 = new PipeUI(
    pipe2,
    { x: 1200, y: 0 },
    { x: 2200, y: 0 },
    app.ticker,
    container
  );

  const sim = new Simulation([ws], [pipe1, pipe2]);

  app.ticker.add((dt) => sim.passTime(dt));

  setInterval(() => {
    sim.addItemToPipe("start-ws1");
  }, 1000);
})();
