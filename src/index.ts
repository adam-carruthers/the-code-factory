import { BitmapFont } from "pixi.js";
import createLabelsSim from "./labelsSim";

(async () => {
  BitmapFont.from("CounterFont", {
    fontFamily: "Arial",
    fontSize: 20,
    align: "center",
  });

  createLabelsSim();
})();
