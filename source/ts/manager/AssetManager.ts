import { Assets } from "pixi.js";
import { TextureAtlas, AtlasAttachmentLoader, SkeletonJson, SpineTexture, SkeletonData } from "@esotericsoftware/spine-pixi-v8";
import type { ResolvedSpineAssets } from "../interfaces/AssetsInterfaces";
import { SpineUploadManager } from "./SpineUploadManager";

export class AssetManager {

  constructor() {
    this.bindEvents();
  }

  protected bindEvents() {
    const input = document.querySelector("#spineUpload") as unknown as HTMLInputElement;

    input.addEventListener("change", this.onFileSelected.bind(this, input));
  }

  async onFileSelected(input: HTMLInputElement): Promise<void> {
    const files = Array.from(input.files || []);

    try {
      const manager = new SpineUploadManager(files);
      const assets = await manager.resolve();

      console.log("Skeleton:", assets.skeleton);
      console.log("Atlas:", assets.atlas);
      console.log("Textures:", assets.textures);

      await this.loadSpineAssets(assets);
      const spineSkeletonData = await this.createSkeletonData();

      const fileName = assets.skeleton.file.name.split('.')[0].replaceAll('_', " ");

      dispatchEvent(new CustomEvent("spineAssetsLoaded", { detail: { label: fileName, skeletonData: spineSkeletonData } }));
    } catch (err) {
      console.error(err);
    }
  }
  /**
   * Load uploaded Spine assets into Pixi and create a Spine instance
   */
  async loadSpineAssets(assets: ResolvedSpineAssets): Promise<void> {
    // Register skeleton and atlas
    Assets.add({ alias: "skeleton", src: assets.skeleton.url, parser: assets.skeleton.type });
    Assets.add({ alias: "atlas", src: assets.atlas.url, parser: "text" });

    // Register all textures
    assets.textures.forEach((t) => {
      Assets.add({ alias: t.file.name, src: t.url, parser: "texture" });
    });

    // Load all assets
    await Assets.load([...assets.textures.map(t => t.file.name), "skeleton", "atlas"]);
  }

  async createSkeletonData(): Promise<SkeletonData> {
    const skeletonJsonData = Assets.get("skeleton");
    const atlasText = Assets.get("atlas");
    const atlas = new TextureAtlas(atlasText);
    atlas.pages.forEach((page: any) => {
      const pixiTexture = Assets.get(page.name);
      if (!pixiTexture) {
        console.error("Texture not found for:", page.name);
        return;
      }
      //@ts-ignore
      const spineTexture = new SpineTexture(pixiTexture.source);
      page.setTexture(spineTexture);
    });

    const atlasLoader = new AtlasAttachmentLoader(atlas);
    const skeletonJson = new SkeletonJson(atlasLoader);
    const skeletonData = skeletonJson.readSkeletonData(skeletonJsonData);

    return skeletonData;
  }
}