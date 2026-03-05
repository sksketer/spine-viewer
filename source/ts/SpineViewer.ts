// SpineViewer.ts
import { Application, Assets } from "pixi.js";
import { Spine, TextureAtlas, AtlasAttachmentLoader, SkeletonJson, SpineTexture } from "@esotericsoftware/spine-pixi-v8";
import { ResolvedSpineAssets } from "./interfaces/AssetsInterfaces";

export class SpineViewer {
  private readonly app: Application;
  private spine?: Spine;

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Load uploaded Spine assets into Pixi and create a Spine instance
   */
  async loadAssets(assets: ResolvedSpineAssets): Promise<void> {
    // Clear previous Spine if exists
    if (this.spine) {
      this.app.stage.removeChild(this.spine);
      //@ts-ignore
      this.spine.destroy({ children: true, texture: true, baseTexture: true });
      this.spine = undefined;
    }

    // Register skeleton and atlas
    Assets.add({ alias: "skeleton", src: assets.skeleton.url, parser: assets.skeleton.type });
    Assets.add({ alias: "atlas", src: assets.atlas.url, parser: "text" });

    // Register all textures
    assets.textures.forEach((t) => {
      Assets.add({ alias: t.file.name, src: t.url, parser: "texture" });
    });

    // Load all assets
    await Assets.load([...assets.textures.map(t => t.file.name), "skeleton", "atlas"]);

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

    // Create Spine instance
    this.spine = new Spine(skeletonData);

    // Center spine on screen
    this.spine.x = this.app.screen.width / 2;
    this.spine.y = this.app.screen.height;

    // Optional scaling
    this.spine.scale.set(0.5);

    this.app.stage.addChild(this.spine);

    // Auto-play first animation
    const animations = this.spine.skeleton.data.animations;
    if (animations.length > 0) {
      this.playAnimation(animations[0].name, true);
    }
  }

  // -------------------------------
  // Public Methods
  // -------------------------------

  playAnimation(name: string, loop = true) {
    if (!this.spine) return;
    this.spine.state.setAnimation(0, name, loop);
  }

  stopAnimation() {
    if (!this.spine) return;
    this.spine.state.clearTracks();
  }

  setSkin(name: string) {
    if (!this.spine) return;
    this.spine.skeleton.setSkinByName(name);
    this.spine.skeleton.setSlotsToSetupPose();
  }

  setPosition(x: number, y: number) {
    if (!this.spine) return;
    this.spine.x = x;
    this.spine.y = y;
  }

  setScale(scale: number) {
    if (!this.spine) return;
    this.spine.scale.set(scale);
  }

  destroy() {
    if (!this.spine) return;
    this.app.stage.removeChild(this.spine);
    //@ts-ignore
    this.spine.destroy({ children: true, texture: true, baseTexture: true });
    this.spine = undefined;
  }
}