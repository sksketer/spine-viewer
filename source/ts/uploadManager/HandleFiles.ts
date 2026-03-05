import { SpineUploadManager } from "./SpineUploadManager";

export class HandleFiles {

  constructor() {
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
    } catch (err) {
      console.error(err);
    }
  }
}