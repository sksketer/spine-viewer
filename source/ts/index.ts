/** ------------------------------------------ */
console.log("setup ready!");
import { Application } from "pixi.js";
import { SpineViewer } from "./SpineViewer";
/** ------------------------------------------ */

import { HandleFiles } from "./uploadManager/HandleFiles";
import { SpineViewerSpin } from "./UI/SpineViewerSpin";
import { SkeletonData, SpineOptions } from "@esotericsoftware/spine-pixi-v8";

let isFirstLoad = false;

(async () => {
  const app = new Application();
  (globalThis as any).__PIXI_APP__ = app;
  await app.init({ background: '#1099bb', width: 1280, height: 720 });
  document.body.appendChild(app.canvas);
  app.canvas.style.display = "none";

  const spineViewer = new SpineViewer();

  const loadedFilesData = new HandleFiles(spineViewer);
})();

addEventListener("spineAssetsLoaded", (e: Event) => {
  !isFirstLoad && hideFirstLoadData();
  createSpine((e as CustomEvent).detail);
});

const hideFirstLoadData = () => {
  isFirstLoad = true;
  const canvas = document.body.getElementsByTagName('canvas')[0];
  canvas.style.display = "block";

  const mainContainer: any = document.getElementsByClassName("main-container")[0];
  mainContainer.style.display = "none";
};

const createSpine = (skeletonData: SpineOptions | SkeletonData) => {
  const spine = new SpineViewerSpin({ skeletonData });
  spine.setPosition(640, 360);
  console.log("Spine Name:", spine.label);
};
