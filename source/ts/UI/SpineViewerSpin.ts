import { SkeletonData, Spine, SpineOptions } from "@esotericsoftware/spine-pixi-v8";
import { Container } from "pixi.js";

export interface ISpineData {
  x?: number;
  y?: number;
  scale?: number;
  skeletonData: SpineOptions | SkeletonData;
  parentContainer?: Container;
}

export class SpineViewerSpin extends Spine {
  constructor(spineData: ISpineData) {
    super(spineData.skeletonData);
    this.setPosition(spineData?.x ?? 0, spineData?.y ?? 0);
    this.setScale(spineData?.scale ?? 1);
    this.setParent(spineData?.parentContainer ?? (globalThis as any).__PIXI_APP__.stage);
  }

  playAnimation(name: string, loop = false) {
    if (!this) return;
    this.state.setAnimation(0, name, loop);
  }

  stopAnimation() {
    if (!this) return;
    this.state.clearTracks();
  }

  setSkin(name: string) {
    if (!this) return;
    this.skeleton.setSkinByName(name);
    this.skeleton.setSlotsToSetupPose();
  }

  setPosition(x: number, y: number) {
    if (!this) return;
    this.x = x;
    this.y = y;
  }

  setScale(scale: number) {
    if (!this) return;
    this.scale.set(scale);
  }

  setParent(parentContainer: Container): void {
    parentContainer?.addChild(this);
  }
}
