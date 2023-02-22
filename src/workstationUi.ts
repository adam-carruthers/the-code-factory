import { Container, Sprite, Ticker } from "pixi.js";
import { Coords } from "./types";
import Workstation from "./workstation";
import waitingArea from "./waitingArea.png";
import workstationImg from "./workstation.png";

export default class WorkstationUI {
  workstation: Workstation;
  container: Container;
  waitingAreaSprite: Sprite;
  mainAreaSprite: Sprite;

  constructor(
    workstation: Workstation,
    position: Coords,
    parentContainer: Container,
    ticker: Ticker
  ) {
    this.workstation = workstation;
    this.container = new Container();
    parentContainer.addChild(this.container);
    this.container.x = position.x;
    this.container.y = position.y;
    this.container.scale.x = 0.5;
    this.container.scale.y = 0.5;

    this.waitingAreaSprite = Sprite.from(waitingArea);
    this.container.addChild(this.waitingAreaSprite);
    this.mainAreaSprite = Sprite.from(workstationImg);
    this.mainAreaSprite.x = 800;
    this.container.addChild(this.mainAreaSprite);

    ticker.add(this.tick);
    this.tick();
  }

  tick = () => {};
}
