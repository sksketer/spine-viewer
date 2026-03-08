import { Application, Container } from "pixi.js";
import { ICanvasOptions } from "./interfaces/interface";
import { ISVSpineData, SVSpine } from "./spine-core/SVSpine";

export class SpineViewer {

  // main pixi application instance
  private stage?: Application;

  private readonly parent?: HTMLElement;
  private readonly canvasProps?: ICanvasOptions;
  private scene: Container;

  constructor(parent: HTMLElement, canvasProps: ICanvasOptions) {
    this.parent = parent;
    this.canvasProps = canvasProps;
    this.bindHandler();
  }

  bindHandler(): void {
    addEventListener("spineAssetsLoaded", (e: Event) => {
      this.createSpine((e as CustomEvent).detail);
    });
  }

  async init(): Promise<void> {
    this.stage = new Application();
    (globalThis as any).__PIXI_APP__ = this.stage;
    await this.stage.init({
      background: this.canvasProps?.background ?? '#1099bb',
      width: this.canvasProps?.width,
      height: this.canvasProps?.height
    });
    this.parent?.appendChild(this.stage.canvas);
    this.initializeMainScene();
  }

  initializeMainScene(): void {
    this.scene = new Container();
    this.scene.label = "Main Scene";
    this.stage?.stage.addChild(this.scene);
  }

  async getStage(): Promise<Application | undefined> {
    if (!this.stage) {
      await this.init();
    }
    return this.stage;
  }

  createSpine(spineData: ISVSpineData): void {
    const spine = new SVSpine({
      ...spineData,
      x: (this.canvasProps?.width ?? 0) / 2,
      y: (this.canvasProps?.height ?? 0) / 2,
      parentContainer: this.scene
    });
    console.log("Spine Name:", spine.label);
  }
}
