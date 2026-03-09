import { SkeletonData } from "@esotericsoftware/spine-pixi-v8";
import { Application } from "pixi.js";
import { AssetManager } from "../manager/AssetManager";
import { Model } from "../model/Model";

export interface ICanvasOptions {
  width: number;
  height: number;
  background?: number | string;
}

export interface ISpineViewer {
  stage: Application;
  spineData: Array<ISpineData>;
  assetsManager: AssetManager;
  model: Model;
}

export interface ISpineData {
  version: string;
  label: string;
  skeleton: SkeletonData;
  blogData?: any;
}