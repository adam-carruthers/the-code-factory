export default class Workstation {
  workTime: number;
  waitListCount: number;
  ongoingJob: null | { timeRemaining: number };

  constructor(workTime: number) {
    this.workTime = workTime;
    this.waitListCount = 0;
    this.ongoingJob = null;
  }
}
