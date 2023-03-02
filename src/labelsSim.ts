import { Application, Container, Text } from "pixi.js";
import createThreeStationSim from "./threeStationSim";

export default function createLabelsSim() {
  const app = new Application({
    background: "#dddddd",
    height: 300,
    width: 1200,
  });

  document
    .getElementById("labels-sim")
    // @ts-ignore
    ?.appendChild(app.view);

  const container = new Container();
  container.y = app.screen.height / 2 - 20;
  app.stage.addChild(container);

  createThreeStationSim(app, container);

  const label1 = addLabel(container, 315, 80);
  const label2 = addLabel(container, 615, 80);
  const label3 = addLabel(container, 915, 80);

  addButton("button-sofa-factory", {
    "Cut wood to size": label1,
    "Nail wood together": label2,
    "Add fabric": label3,
  });

  addButton("button-software-development", {
    "Do user research": label1,
    "Write code": label2,
    "Deploy to prod": label3,
  });

  addButton("button-plumbus", {
    "Smooth out dingleblot": label1,
    "Rub against the fleeb": label2,
    "Shave away ploobus\nand grumbo": label3,
  });

  addButton("button-clear-labels", {
    "": label1,
    " ": label2,
    "  ": label3,
  });
}

function addButton(
  buttonId: string,
  labelByMessage: { [message: string]: Text }
) {
  const el = document.getElementById(buttonId);

  if (!el) throw new Error(`Couldn't find element with ID #${buttonId}`);

  el.onclick = () => {
    console.log("clicked", buttonId);

    Object.entries(labelByMessage).forEach(([message, label]) => {
      label.text = message;
    });
  };
}

function addLabel(parent: Container, x: number, y: number) {
  const text = new Text("", { align: "center" });
  text.x = x;
  text.y = y;
  text.anchor.set(0.5, 0);
  parent.addChild(text);

  return text;
}
