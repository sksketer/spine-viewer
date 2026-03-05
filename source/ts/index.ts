/** ------------------------------------------ */
console.log("setup ready!");
import { Application } from "pixi.js";
import { SpineViewer } from "./SpineViewer";
/** ------------------------------------------ */

import { HandleFiles } from "./uploadManager/HandleFiles";

(async () => {
  const app = new Application();
  (globalThis as any).__PIXI_APP__ = app;
  await app.init({ background: '#1099bb', resizeTo: window });
  document.body.appendChild(app.canvas);
  app.canvas.style.display = "none";

  const spineViewer = new SpineViewer(app);

  const loadedFilesData = new HandleFiles(spineViewer);
})();

addEventListener("spineAssetsLoaded", (e: Event) => {
  const customEvent = e as CustomEvent;

  console.log("Spine Name:", customEvent.detail.name);

  const canvas = document.body.getElementsByTagName('canvas')[0];
  canvas.style.display = "block";

  const mainContainer: any = document.getElementsByClassName("main-container")[0];
  mainContainer.style.display = "none";
});
