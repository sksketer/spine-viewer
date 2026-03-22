import { SVSpine } from "./SVSpine";
import { ControllerUI } from "./ControllerUI";

export class SpineController {
  private readonly spine: SVSpine;
  private readonly animationNames: Array<string>;
  private isLooping: boolean | undefined = undefined;
  private isPaused = false;
  private uiCreator: ControllerUI;

  private readonly onPositionUpdated = (e: Event): void => {
    const detail = (e as CustomEvent<{ spine: SVSpine }>).detail;
    if (detail?.spine !== this.spine) {
      return;
    }
    this.updatePositionInputs();
  };

  private readonly onScaleUpdated = (e: Event): void => {
    const detail = (e as CustomEvent<{ spine: SVSpine }>).detail;
    if (detail?.spine !== this.spine) {
      return;
    }
    this.updateScaleInputs();
  };

  constructor(spine: SVSpine) {
    this.spine = spine;
    this.animationNames = spine.skeleton.data.animations.map((a) => a.name);
  }

  public init(): void {
    this.isLooping = false;
    this.uiCreator = new ControllerUI(this.spine, this.animationNames);
    this.uiCreator.init();
    this.bindHandlers();
  }

  private bindHandlers(): void {
    this.bindAnimationHandler();
    this.bindLoopHandler();
    this.bindPositionHandler();
    this.bindScaleHandler();
    this.bindAnimationStatus();
    addEventListener("SPINE_POSITION_UPDATED", this.onPositionUpdated);
    addEventListener("SPINE_SCALE_UPDATED", this.onScaleUpdated);
    addEventListener("TOGGLE_SPINE_CONTROLLER_VISIBILITY", this.toggleControllerVisibility.bind(this));
  }

  private toggleControllerVisibility(e: Event): void {
    const detail = (e as CustomEvent<{ spine: string, visibility: boolean }>).detail;
    if (detail.spine !== this.spine.label) return;
    // show controller only if the event is for this spine instance
    const controllerDiv = this.uiCreator.getMainDiv();
    controllerDiv.style.display = detail.visibility ? "grid" : "none";
  }

  private bindAnimationHandler(): void {
    const select = this.uiCreator.getAnimationSelect();
    select.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      const animationName = target.value;
      this.isPaused = false;
      this.spine.state.timeScale = 1;
      this.uiCreator.setPlayPauseState(this.isPaused);
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

  private bindAnimationStatus(): void {
    const playPauseButton = this.uiCreator.getPlayPauseButton();
    this.uiCreator.setPlayPauseState(this.isPaused);

    playPauseButton.addEventListener("click", () => {
      this.isPaused = !this.isPaused;
      this.spine.state.timeScale = this.isPaused ? 0 : 1;
      this.uiCreator.setPlayPauseState(this.isPaused);
    });
  }
}
