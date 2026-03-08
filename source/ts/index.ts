/** ------------------------------------------ */
console.log("setup ready!");
/** ------------------------------------------ */

import { ISpineData, ISpineViewer } from "./interfaces/interface";
import { SpineViewer } from "./SpineViewer";
import { AssetManager } from "./manager/AssetManager";
import { UIManager } from "./manager/UIManager";

declare global {
  var spineViewer: ISpineViewer;
}

const stageDIV = (document.getElementById("stage") ?? document.body);
const stage = new SpineViewer(stageDIV, { width: 1280, height: innerHeight });
new UIManager();

(async () => {
  globalThis.spineViewer = {
    stage: await stage.getStage(),
    spineData: [] as Array<ISpineData>,
    assetsManager: new AssetManager(),
  };
})();
