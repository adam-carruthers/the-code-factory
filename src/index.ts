import { Application, Assets, Sprite } from "pixi.js";
import packageImg from "./package.png";

(async () => {
  const app = new Application({ background: "#6ee0fa" });

  document
    .getElementById("constrained-capacity-container")
    // @ts-ignore
    ?.appendChild(app.view);

  // load the texture we need
  const packageTexture = await Assets.load(packageImg);
})();
