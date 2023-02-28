import { Sprite, Container } from "pixi.js";
import ItemInTransit from "./itemInTransit";
import Pipe from "./pipe";
import packageImg from "./package.png";
import { Coords } from "./types";
import MyTicker from "./ticker";

export default class PipeUI {
  simPipe: Pipe;
  startCoords: Coords;
  endCoords: Coords;
  ticker: MyTicker;
  container: Container;

  constructor(
    simPipe: Pipe,
    startCoords: Coords,
    endCoords: Coords,
    ticker: MyTicker,
    parentContainer: Container
  ) {
    this.startCoords = startCoords;
    this.endCoords = endCoords;
    this.ticker = ticker;
    this.container = new Container();
    parentContainer.addChild(this.container);
    this.simPipe = simPipe;
    simPipe.registerCreateCb(this.createCb);
  }

  createCb = (iit: ItemInTransit) => {
    const box = Sprite.from(packageImg);
    box.x = this.startCoords.x;
    box.y = this.startCoords.y;
    box.anchor.set(0.5);

    this.container.addChild(box);

    const boxUpdate = (dt: number) => {
      const propLeft = iit.timeLeft / iit.timeToDestination;

      box.x = this.startCoords.x * propLeft + this.endCoords.x * (1 - propLeft);
      box.y = this.startCoords.y * propLeft + this.endCoords.y * (1 - propLeft);
    };

    this.ticker.add(boxUpdate);

    return () => {
      this.container.removeChild(box);
      this.ticker.remove(boxUpdate);
      box.destroy();
    };
  };
}
