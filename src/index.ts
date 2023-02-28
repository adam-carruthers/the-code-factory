import { Application, BitmapFont, Container } from "pixi.js";
import Pipe from "./pipe";
import PipeUI from "./pipeUI";
import Simulation from "./simulation";
import Workstation from "./workstation";
import WorkstationUI from "./workstationUi";
import * as PIXI from "pixi.js";
import MyTicker from "./ticker";

(async () => {
  const app = new Application({
    background: "#dddddd",
    height: 300,
    width: 1000,
  });

  BitmapFont.from("CounterFont", {
    fontFamily: "Arial",
    fontSize: 20,
    align: "center",
  });

  document
    .getElementById("constrained-capacity-container")
    // @ts-ignore
    ?.appendChild(app.view);

  const container = new Container();
  container.y = app.screen.height / 2;
  app.stage.addChild(container);

  const myTicker = new MyTicker();

  const pipe1 = new Pipe("start-ws1", 100, null, "ws1");
  const pipeUi1 = new PipeUI(
    pipe1,
    { x: -50, y: 0 },
    { x: 150, y: 0 },
    myTicker,
    container
  );

  const pipe2 = new Pipe("ws1-ws2", 100, "ws1", "ws2");
  const pipeUi2 = new PipeUI(
    pipe2,
    { x: 250, y: 0 },
    { x: 450, y: 0 },
    myTicker,
    container
  );

  const pipe3 = new Pipe("ws2-end", 300, "ws2", null);
  const pipeUi3 = new PipeUI(
    pipe3,
    { x: 550, y: 0 },
    { x: 1150, y: 0 },
    myTicker,
    container
  );

  const ws = new Workstation(60, "ws1");
  const wsUi = new WorkstationUI(ws, { x: 150, y: 0 }, container, myTicker);

  const ws2 = new Workstation(80, "ws2");
  const wsUi2 = new WorkstationUI(ws2, { x: 450, y: 0 }, container, myTicker);

  const sim = new Simulation([ws, ws2], [pipe1, pipe2, pipe3]);

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
})();
