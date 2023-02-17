export interface UpdateInfo {
  waitListCount: number;
}

export default class Workstation {
  workTime: number;
  waitListCount: number;
  ongoingJob: null | { timeRemaining: number };
  id: string;

  constructor(workTime: number, workstationId: string = "NOTSET") {
    this.workTime = workTime;
    this.waitListCount = 0;
    this.ongoingJob = null;
    this.id = workstationId;
  }

  getNextEventTime = () => {
    return this.ongoingJob?.timeRemaining ?? Infinity;
  };

  passTime = (dt: number) => {
    if (!this.ongoingJob) return;
    if (dt > this.ongoingJob.timeRemaining)
      throw new Error(
        "ItemInTransit was asked to pass time longer than the time left in transit"
      );

    this.ongoingJob.timeRemaining -= dt;
  };

  #startOngoingJob = () => {
    if (this.ongoingJob)
      throw new Error("Trying to start ongoing job when one is already going");
    if (this.waitListCount <= 0)
      throw new Error(
        "There is no items in the wait list, so job cannot start"
      );

    this.waitListCount -= 1;
    this.ongoingJob = { timeRemaining: this.workTime };
  };

  receiveItem = () => {
    this.waitListCount += 1;
    if (!this.ongoingJob) this.#startOngoingJob();
  };

  runEvent = () => {
    if (!this.ongoingJob)
      throw new Error(
        "Tried to run event in workstation without an ongoing job."
      );
    if (this.ongoingJob.timeRemaining !== 0)
      throw new Error(
        "Tried to run event in workstation when time left was not 0"
      );

    this.ongoingJob = null;
    if (this.waitListCount > 0) this.#startOngoingJob();
  };
}
