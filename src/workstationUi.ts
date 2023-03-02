import {
  BitmapFont,
  BitmapText,
  Container,
  Graphics,
  Sprite,
  TextStyle,
} from "pixi.js";
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
  completionBar: Graphics;

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
    this.waitingCount.anchor.set(0.5, 0);
    this.updateWaitingCount();
    this.container.addChild(this.waitingCount);

    this.completionBar = new Graphics();
    this.completionBar.x = 30;
    this.completionBar.y = 65;
    this.updateCompletionBar();
    this.container.addChild(this.completionBar);

    ticker.add(this.tick);
    this.tick();
  }

  tick = () => {
    this.updateWaitingCount();
    this.updateCompletionBar();
  };

  updateWaitingCount = () => {
    this.waitingCount.text = `${this.workstation.waitListCount}`;
  };

  updateCompletionBar = () => {
    this.completionBar.clear();
    if (this.workstation.getNextEventTime() === Infinity) return;
    this.completionBar.beginFill(0xff0000);
    this.completionBar.drawRect(0, 0, 100, 5);
    this.completionBar.endFill();
    this.completionBar.beginFill(0x00ff00);
    this.completionBar.drawRect(
      0,
      0,
      (100 * this.workstation.getNextEventTime()) / this.workstation.workTime,
      5
    );
    this.completionBar.endFill();
  };
}
