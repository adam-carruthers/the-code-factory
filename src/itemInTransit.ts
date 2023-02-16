export default class ItemInTransit {
  timeToDestination: number;
  timeLeft: number;

  constructor(timeToDestination: number) {
    this.timeToDestination = timeToDestination;
    this.timeLeft = timeToDestination;
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

  runEvent = () => {
    if (this.timeLeft !== 0)
      throw new Error(
        `Event was run when the time left was not 0 (it was ${this.timeLeft})`
      );
  };
}
