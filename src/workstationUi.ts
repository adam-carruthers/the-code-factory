import { BitmapFont, BitmapText, Container, Sprite, TextStyle } from "pixi.js";
import { Coords } from "./types";
import Workstation from "./workstation";
import waitingArea from "./waitingArea.png";
import workstationImg from "./workstation.png";
import MyTicker from "./ticker";

export default class WorkstationUI {
  workstation: Workstation;
  container: Container;
  waitingAreaSprite: Sprite;
  mainAreaSprite: Sprite;
  waitingCount: BitmapText;

  constructor(
    workstation: Workstation,
    position: Coords,
    parentContainer: Container,
    ticker: MyTicker
  ) {
    this.workstation = workstation;
    this.container = new Container();
    parentContainer.addChild(this.container);
    this.container.x = position.x;
    this.container.y = position.y;

    this.mainAreaSprite = Sprite.from(workstationImg);
    this.mainAreaSprite.x = 80;
    this.mainAreaSprite.anchor.set(0.5);
    this.container.addChild(this.mainAreaSprite);

    this.waitingAreaSprite = Sprite.from(waitingArea);
    this.waitingAreaSprite.anchor.set(0.5);
    this.container.addChild(this.waitingAreaSprite);

    this.waitingCount = new BitmapText("0", {
      fontName: "CounterFont",
      align: "center",
    });
    this.waitingCount.y = 30;
    this.waitingCount.x = -this.waitingCount.textWidth / 2;
    this.container.addChild(this.waitingCount);

    ticker.add(this.tick);
    this.tick();
  }

  tick = () => {
    this.waitingCount.text = `${this.workstation.waitListCount}`;
    this.waitingCount.x = -this.waitingCount.textWidth / 2;
  };
}
