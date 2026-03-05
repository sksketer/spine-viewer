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

  const spineViewer = new SpineViewer(app);

  const loadedFilesData = new HandleFiles(spineViewer);
})();
