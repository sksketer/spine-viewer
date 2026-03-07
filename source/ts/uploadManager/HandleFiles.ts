import { Utils } from "../utils";
import { SpineUploadManager } from "./SpineUploadManager";

export class HandleFiles {

  private readonly utils: Utils;

  constructor(utils: Utils) {
    this.utils = utils;
    this.bindEvents();
  }

  protected bindEvents() {
    const input = document.querySelector("#spineUpload") as unknown as HTMLInputElement;

    input.addEventListener("change", this.onFileSelected.bind(this, input));
  }

  private async onFileSelected(input: HTMLInputElement): Promise<void> {
    const files = Array.from(input.files || []);

    try {
      const manager = new SpineUploadManager(files);
      const assets = await manager.resolve();

      console.log("Skeleton:", assets.skeleton);
      console.log("Atlas:", assets.atlas);
      console.log("Textures:", assets.textures);

      await this.utils.loadAssets(assets);
      const spineSkeletonData = await this.utils.createSkeletonData();

      const fileName = assets.skeleton.file.name.split('.')[0].replaceAll('_', " ");

      dispatchEvent(new CustomEvent("spineAssetsLoaded", { detail: { label: fileName, skeletonData: spineSkeletonData } }));
    } catch (err) {
      console.error(err);
    }
  }
}