import { Assets } from "pixi.js";
import { TextureAtlas, AtlasAttachmentLoader, SkeletonBinary, SkeletonJson, SpineTexture, SkeletonData } from "@esotericsoftware/spine-pixi-v8";
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
    let assets: ResolvedSpineAssets | undefined;

    try {
      const manager = new SpineUploadManager(files);
      assets = await manager.resolve();

      console.log("Skeleton:", assets.skeleton);
      console.log("Atlas:", assets.atlas);
      console.log("Textures:", assets.textures);

      await this.loadSpineAssets(assets);
      const spineSkeletonData = await this.createSkeletonData(assets);

      const fileName = assets.skeleton.file.name.split('.')[0];

      dispatchEvent(new CustomEvent("spineAssetsLoaded", { detail: { label: fileName, skeletonData: spineSkeletonData } }));
    } catch (err) {
      console.error("Failed to load Spine assets", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(`Error loading Spine assets: ${errorMessage}`);
    } finally {
      if (assets) {
        this.revokeObjectUrls(assets);
      }
    }
  }
  /**
   * Load uploaded Spine assets into Pixi and create a Spine instance
   */
  async loadSpineAssets(assets: ResolvedSpineAssets): Promise<void> {
    // Register all textures
    assets.textures.forEach((t) => {
      Assets.add({ alias: t.file.name, src: t.url, parser: "texture" });
    });

    // Load all textures referenced by atlas pages
    await Assets.load([...assets.textures.map(t => t.file.name)]);
  }

  async createSkeletonData(assets: ResolvedSpineAssets): Promise<SkeletonData> {
    const atlasText = await assets.atlas.file.text();
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
    const skeletonData = assets.skeleton.type === "binary"
      ? new SkeletonBinary(atlasLoader).readSkeletonData(new Uint8Array(await assets.skeleton.file.arrayBuffer()))
      : new SkeletonJson(atlasLoader).readSkeletonData(JSON.parse(await assets.skeleton.file.text()));

    return skeletonData;
  }

  private revokeObjectUrls(assets: ResolvedSpineAssets): void {
    URL.revokeObjectURL(assets.skeleton.url);
    URL.revokeObjectURL(assets.atlas.url);
    assets.textures.forEach((texture) => {
      URL.revokeObjectURL(texture.url);
    });
  }
}