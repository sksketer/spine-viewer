import { Application, Container } from "pixi.js";
import { ICanvasOptions } from "./interfaces/interface";
import { ISVSpineData, SVSpine } from "./spine-core/SVSpine";

export class SpineViewer {

  // main pixi application instance
  private stage?: Application;

  private readonly parent?: HTMLElement;
  private readonly canvasProps?: ICanvasOptions;
  private readonly spineInstances: Array<SVSpine> = [];
  private isSpineSelectorBound = false;
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
    dispatchEvent(new CustomEvent("SCENE_READY", { detail: { canvasProps: { width: this.stage.canvas.width, height: this.stage.canvas.height } } }));
  }

  async getStage(): Promise<Application | undefined> {
    if (!this.stage) {
      await this.init();
    }
    return this.stage;
  }

  createSpine(spineData: ISVSpineData): void {
    this.hideAllController();
    const spine = new SVSpine({
      ...spineData,
      x: (this.canvasProps?.width ?? 0) / 2,
      y: (this.canvasProps?.height ?? 0) / 2,
      parentContainer: this.scene
    });
    console.log("Spine Name:", spine.label);
    this.addSpineInstane(spine);
    dispatchEvent(new CustomEvent("TOGGLE_SPINE_CONTROLLER_VISIBILITY", { detail: { spine: spine.label, visibility: true } }));
  }

  private addSpineInstane(spine: SVSpine): void {
    this.spineInstances.push(spine);

    const spinesReferences: any = document.getElementById("spineSelector") as HTMLSelectElement;
    if (!spinesReferences) {
      return;
    }

    const option = document.createElement("option");
    option.value = spine.label;
    option.text = spine.label;
    spinesReferences.add(option);

    if (!this.isSpineSelectorBound) {
      spinesReferences.addEventListener("change", (e: Event) => {
        const target = e.target as HTMLSelectElement;
        this.hideAllController();
        dispatchEvent(new CustomEvent("TOGGLE_SPINE_CONTROLLER_VISIBILITY", {
          detail: { spine: target.value, visibility: true }
        }));
      });
      this.isSpineSelectorBound = true;
    }

    spinesReferences.value = spine.label;

  }

  private hideAllController(): void {
    this.spineInstances.forEach(spine => {
      dispatchEvent(new CustomEvent("TOGGLE_SPINE_CONTROLLER_VISIBILITY", { detail: { spine: spine.label, visibility: false } }));
    });
  }
}
