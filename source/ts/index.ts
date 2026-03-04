console.log("setup ready!");


import { SpineUploadManager } from "./SpineUploadManager";

const input = document.querySelector("#spineUpload") as HTMLInputElement;

input.addEventListener("change", async () => {
  const files = Array.from(input.files || []);

  try {
    const manager = new SpineUploadManager(files);
    const assets = await manager.resolve();

    console.log("Skeleton:", assets.skeleton);
    console.log("Atlas:", assets.atlas);
    console.log("Textures:", assets.textures);

    // Now pass to Pixi Assets loader
  } catch (err) {
    console.error(err);
  }
});