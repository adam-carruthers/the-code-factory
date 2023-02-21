import ItemInTransit from "./itemInTransit";

type DestroyCb = () => void;
type CreateCb = (iit: ItemInTransit) => DestroyCb;
type ItemInTransitMeta = { iit: ItemInTransit; destroyCb: DestroyCb };

export default class Pipe {
  id: string;
  travelTime: number;
  itemInTransitMetas: ItemInTransitMeta[];
  createCb?: CreateCb;
  nextDest: string | null;
  fromWorkspaceId: string | null;
  toWorkspaceId: string | null;

  constructor(
    pipeId: string,
    travelTime: number,
    fromWorkspaceId: string | null,
    toWorkspaceId: string | null
  ) {
    this.id = pipeId;
    this.itemInTransitMetas = [];
    this.travelTime = travelTime;
    this.fromWorkspaceId = fromWorkspaceId;
    this.toWorkspaceId = toWorkspaceId;
  }

  registerCreateCb = (createCb: CreateCb) => {
    this.createCb = createCb;
  };

  addItem = () => {
    const iit = new ItemInTransit(this.travelTime);
    const destroyCb = this.createCb?.(iit) || (() => null);
    this.itemInTransitMetas.push({ iit, destroyCb });
  };

  getNextEventTime = () => {
    return Math.min(
      ...this.itemInTransitMetas.map(({ iit }) => iit.getNextEventTime())
    );
  };

  passTime = (dt: number) => {
    this.itemInTransitMetas.forEach(({ iit }) => iit.passTime(dt));
  };

  runItemLeavesPipeEvent = () => {
    const toDeleteIndex = this.itemInTransitMetas.findIndex(
      (iitMeta) => iitMeta.iit.getNextEventTime() === 0
    );

    if (toDeleteIndex === -1)
      throw new Error(
        "Tried to run event on pipe but there are no items in transit with next event time === 0"
      );

    const toDeleteMeta = this.itemInTransitMetas[toDeleteIndex];

    toDeleteMeta.iit.runTransitEndsEvent();
    toDeleteMeta.destroyCb();

    this.itemInTransitMetas.splice(toDeleteIndex, 1);
  };
}
