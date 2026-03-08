import { SkeletonData } from "@esotericsoftware/spine-pixi-v8";
import { Application } from "pixi.js";
import { AssetManager } from "../manager/AssetManager";

export interface ICanvasOptions {
  width: number;
  height: number;
  background?: number | string;
}

export interface ISpineViewer {
  stage: Application;
  spineData: Array<ISpineData>;
  assetsManager: AssetManager;
}

export interface ISpineData {
  version: string;
  label: string;
  skeleton: SkeletonData;
  blogData?: any;
}