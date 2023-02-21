import { Application, Container } from "pixi.js";
import Pipe from "./pipe";
import PipeUI from "./pipeUI";
import Simulation from "./simulation";

(async () => {
  const app = new Application({ background: "#6ee0fa" });

  document
    .getElementById("constrained-capacity-container")
    // @ts-ignore
    ?.appendChild(app.view);

  const container = new Container();
  container.scale.x = 0.5;
  container.scale.y = 0.5;
  app.stage.addChild(container);

  const pipe = new Pipe("test", 100, null, null);
  const pipeUi = new PipeUI(
    pipe,
    { x: 0, y: 0 },
    { x: 800, y: 0 },
    app.ticker,
    container
  );

  const sim = new Simulation([], [pipe]);

  app.ticker.add((dt) => sim.passTime(dt));

  setInterval(() => {
    sim.addItemToPipe("test");
  }, 1000);
})();
