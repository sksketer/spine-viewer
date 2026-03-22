import { SVSpine } from "./SVSpine";
import { ControllerUI } from "./ControllerUI";

export class SpineController {
  private readonly spine: SVSpine;
  private readonly animationNames: Array<string>;
  private isLooping: boolean | undefined = undefined;
  private uiCreator: ControllerUI;

  constructor(spine: SVSpine) {
    this.spine = spine;
    this.animationNames = spine.skeleton.data.animations.map((a) => a.name);
  }

  public async init(): Promise<void> {
    this.isLooping = false;
    this.uiCreator = new ControllerUI(this.spine, this.animationNames);
    await this.uiCreator.init();
    this.bindHandlers();
  }

  private bindHandlers(): void {
    this.bindAnimationHandler();
    this.bindLoopHandler();
    this.bindPositionHandler();
    this.bindScaleHandler();
    addEventListener("SPINE_POSITION_UPDATED", this.updatePositionInputs.bind(this));
    addEventListener("SPINE_SCALE_UPDATED", this.updateScaleInputs.bind(this));
  }

  private bindAnimationHandler() {
    const select = this.uiCreator.getAnimationSelect();
    select.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      const animationName = target.value;
      this.spine.playAnimation(animationName, this.isLooping);
    });

  }

  private bindLoopHandler(): void {
    const loopButton = this.uiCreator.getLoopCheckbox();
    loopButton.checked = false;
    loopButton.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      this.isLooping = target.checked;
      const trackEntry = this.spine.state.getCurrent(0);
      if (trackEntry) {
        trackEntry.loop = this.isLooping;
      }
    });
  }

  private bindPositionHandler(): void {
    const xPositionInput = this.uiCreator.getXPositionInput();
    xPositionInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const x = Number.parseFloat(target.value) || 0;
      this.spine.x = x;
    });

    const yPositionInput = this.uiCreator.getYPositionInput();
    yPositionInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const y = Number.parseFloat(target.value) || 0;
      this.spine.y = y;
    });

    this.updatePositionInputs();
  }

  private updatePositionInputs(): void {
    const xPositionInput = this.uiCreator.getXPositionInput();
    const yPositionInput = this.uiCreator.getYPositionInput();
    xPositionInput.value = this.spine.x.toString();
    yPositionInput.value = this.spine.y.toString();
  }

  private bindScaleHandler(): void {
    const scaleXInput = this.uiCreator.getXScaleInput();
    const scaleYInput = this.uiCreator.getYScaleInput();

    scaleXInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const scaleX = Number.parseFloat(target.value) || 1;
      this.spine.scale.set(scaleX, this.spine.scale.y);
    });

    scaleYInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const scaleY = Number.parseFloat(target.value) || 1;
      this.spine.scale.set(this.spine.scale.x, scaleY);
    });

    this.updateScaleInputs();
  }

  private updateScaleInputs(): void {
    const scaleXInput = this.uiCreator.getXScaleInput();
    const scaleYInput = this.uiCreator.getYScaleInput();
    scaleXInput.value = this.spine.scale.x.toString();
    scaleYInput.value = this.spine.scale.y.toString();
  }
}
