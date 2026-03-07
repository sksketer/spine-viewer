/** ------------------------------------------ */
console.log("setup ready!");
import { Application } from "pixi.js";
import { Utils } from "./utils";
/** ------------------------------------------ */

import { HandleFiles } from "./uploadManager/HandleFiles";
import { SpineViewerSpin } from "./UI/SpineViewerSpin";
import { SkeletonData, SpineOptions } from "@esotericsoftware/spine-pixi-v8";
import { SpineController } from "./SpineController";

let isFirstLoad = false;

(async () => {
  const app = new Application();
  (globalThis as any).__PIXI_APP__ = app;
  const height = innerHeight - (document.getElementById("footer")?.clientHeight ?? 0);
  await app.init({ background: '#1099bb', width: 1280, height: height });
  document.getElementById("stage")?.appendChild(app.canvas);

  const utils = new Utils();

  new HandleFiles(utils);
})();

addEventListener("spineAssetsLoaded", (e: Event) => {
  !isFirstLoad && hideFirstLoadData();
  createSpine((e as CustomEvent).detail);
});

const hideFirstLoadData = () => {
  isFirstLoad = true;

  const uploadContainer: any = document.getElementsByClassName("upload-container")[0];
  uploadContainer.style.display = "none";

  const spineStage: any = document.getElementsByClassName("spineStage")[0];
  spineStage.style.display = "flex";
  const stage: any = document.getElementById("stage");
  stage.style.width = innerWidth / 2;
  stage.style.height = innerHeight;
};

const createSpine = (skeletonData: SpineOptions | SkeletonData) => {
  const spine = new SpineViewerSpin({ skeletonData });
  const parentWidth = (document.getElementsByTagName('canvas')[0] as any).width ?? 0;
  const parentHeight = innerHeight ?? 0;
  spine.setPosition(parentWidth / 2, parentHeight / 2);
  new SpineController(spine, spine.skeleton.data.animations.map((a) => a.name));
  console.log("Spine Name:", spine.label);
};
