export type UpdateCb = (timeLeft: number, timeToDestination: number) => void;
export type EndCb = () => void;

export default class ItemInTransit {
  timeToDestination: number;
  timeLeft: number;
  updateCb: UpdateCb;
  endCb: EndCb;

  constructor(timeToDestination: number, updateCb: UpdateCb, endCb: EndCb) {
    this.timeToDestination = timeToDestination;
    this.timeLeft = timeToDestination;
    this.updateCb = updateCb;
    this.endCb = endCb;
  }

  getNextEventTime = () => {
    return this.timeLeft;
  };

  passTime = (dt: number) => {
    if (dt > this.timeLeft)
      throw new Error(
        "ItemInTransit was asked to pass time longer than the time left in transit"
      );

    this.timeLeft -= dt;
  };

  updateGraphics = () => {
    this.updateCb(this.timeLeft, this.timeToDestination);
  };

  runEvent = () => {
    if (this.timeLeft !== 0)
      throw new Error(
        `Event was run when the time left was not 0 (it was ${this.timeLeft})`
      );

    this.endCb();
  };
}
