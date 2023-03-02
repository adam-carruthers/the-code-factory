import { Container, Text } from "pixi.js";

export default class ProcessLabel {
  text: Text;

  constructor(parent: Container, x: number, y: number) {
    this.text = new Text("");
    this.text.visible = false;
    this.text.x = x;
    this.text.y = y;
    parent.addChild(this.text);
  }
}
