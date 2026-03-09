/** ------------------------------------------ */
console.log("setup ready!");
/** ------------------------------------------ */

import { ISpineData, ISpineViewer } from "./interfaces/interface";
import { SpineViewer } from "./SpineViewer";
import { AssetManager } from "./manager/AssetManager";
import { UIManager } from "./manager/UIManager";
import { Model } from "./model/Model";

declare global {
  var spineViewer: ISpineViewer;
}

const stageDIV = (document.getElementById("stage") ?? document.body);
const model = new Model();
const stage = new SpineViewer(stageDIV, {
  width: model.getCanvasDimension().width,
  height: model.getCanvasDimension().height 
});
new UIManager();

(async () => {
  globalThis.spineViewer = {
    stage: await stage.getStage(),
    spineData: [] as Array<ISpineData>,
    assetsManager: new AssetManager(),
    model
  };
})();
