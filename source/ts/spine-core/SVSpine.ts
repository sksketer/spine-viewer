import { SkeletonData, Spine, SpineOptions } from "@esotericsoftware/spine-pixi-v8";
import { Container, Ticker } from "pixi.js";
import { SpineController } from "./SpineController";

export interface ISVSpineData {
  x?: number;
  y?: number;
  label?: string;
  scale?: number;
  skeletonData: SpineOptions | SkeletonData;
  parentContainer?: Container;
}

export class SVSpine extends Spine {

  private readonly _version: string;

  private xPosition: number = 0;
  private yPosition: number = 0;
  private xScale: number = 1;
  private yScale: number = 1;

  private _tickerFn: () => void;

  constructor(spineData: ISVSpineData) {
    super(spineData.skeletonData);

    this._version = (spineData.skeletonData as SkeletonData).version;

    this.updateProperties(spineData);
    this.initializeController();

    this.startWatching(); // ✅ start tracking changes
  }

  get version(): string {
    return this._version;
  }

  updateProperties(spineData: ISVSpineData): void {
    this.setPosition(spineData?.x ?? 0, spineData?.y ?? 0);
    this.setScale(spineData?.scale ?? 1);
    this.setParent(spineData?.parentContainer ?? (globalThis as any).__PIXI_APP__.stage);
    this.label = spineData.label ?? "Unnamed Spine";
  }

  initializeController(): void {
    const spineController = new SpineController(this);
    spineController.init();
  }

  playAnimation(name: string, loop = false) {
    this.state.setAnimation(0, name, loop);
  }

  stopAnimation() {
    this.state.clearTracks();
  }

  setSkin(name: string) {
    this.skeleton.setSkinByName(name);
    this.skeleton.setSlotsToSetupPose();
  }

  setPosition(x: number, y: number) {
    this.xPosition = this.x = x;
    this.yPosition = this.y = y;
  }

  setScale(scale: number) {
    this.scale.set(scale);
    this.xScale = this.yScale = scale;
  }

  setParent(parentContainer: Container): void {
    parentContainer?.addChild(this);
  }

  // ✅ START WATCHING (Ticker-based)
  private startWatching(): void {
    this._tickerFn = this.updateOnChangeProperties.bind(this);

    const ticker: Ticker = (globalThis as any).__PIXI_APP__.ticker;
    ticker.add(this._tickerFn);
  }

  // ✅ STOP WATCHING (important for cleanup)
  destroy(options?: any): void {
    const ticker: Ticker = (globalThis as any).__PIXI_APP__.ticker;
    ticker.remove(this._tickerFn);

    super.destroy(options);
  }

  // ✅ SAFE CHECK (no recursion)
  private updateOnChangeProperties(): void {

    // Position
    if (this.x !== this.xPosition || this.y !== this.yPosition) {
      this.xPosition = this.x;
      this.yPosition = this.y;

      dispatchEvent(
        new CustomEvent("SPINE_POSITION_UPDATED", {
          detail: { x: this.xPosition, y: this.yPosition }
        })
      );
    }

    // Scale
    if (this.scale.x !== this.xScale || this.scale.y !== this.yScale) {
      this.xScale = this.scale.x;
      this.yScale = this.scale.y;

      dispatchEvent(
        new CustomEvent("SPINE_SCALE_UPDATED", {
          detail: { x: this.xScale, y: this.yScale }
        })
      );
    }
  }
}
