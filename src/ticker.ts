export type GraphicsCallback = (dt: number) => void;

export default class MyTicker {
  callbacks: GraphicsCallback[] = [];

  add = (cb: GraphicsCallback) => {
    this.callbacks.push(cb);
  };

  remove = (cb: GraphicsCallback) => {
    this.callbacks = this.callbacks.filter((existing) => existing !== cb);
  };

  callAllCallbacks = (dt: number) => {
    this.callbacks.forEach((cb) => cb(dt));
  };
}
