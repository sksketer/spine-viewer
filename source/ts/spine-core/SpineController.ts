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

  private readonly onToggleVisibility = (e: Event): void => {
    const detail = (e as CustomEvent<{ spine: SVSpine; visibility: boolean }>).detail;
    if (detail?.spine !== this.spine) {
      return;
    }
    const controllerDiv = this.uiCreator.getMainDiv();
    controllerDiv.style.display = detail.visibility ? "grid" : "none";
  };

  private readonly onDestroyRequested = (e: Event): void => {
    const detail = (e as CustomEvent<{ spine: SVSpine }>).detail;
    if (detail?.spine !== this.spine) {
      return;
    }
    this.dispose();
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
    this.bindVisibilityHandler();
    this.bindAlphaHandler();
    this.bindAnimationSpeedHandler();
    this.bindPositionHandler();
    this.bindScaleHandler();
    this.bindResetPositionHandler();
    this.bindResetScaleHandler();
    this.bindAnimationStatus();
    this.bindDestroyHandler();
    addEventListener("SPINE_POSITION_UPDATED", this.onPositionUpdated);
    addEventListener("SPINE_SCALE_UPDATED", this.onScaleUpdated);
    addEventListener("TOGGLE_SPINE_CONTROLLER_VISIBILITY", this.onToggleVisibility);
    addEventListener("SPINE_DESTROY_REQUESTED", this.onDestroyRequested);
  }

  private bindAnimationHandler(): void {
    const select = this.uiCreator.getAnimationSelect();
    select.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      const animationName = target.value;
      this.isPaused = false;
      this.handleAnimationSpeedChange(1);
      this.checkAndRemoveSelectAnimationOption();
      this.uiCreator.setPlayPauseState(this.isPaused);
      if (this.animationNames.includes(animationName)) {
        this.spine.playAnimation(animationName, this.isLooping);
      }
    });
  }

  private checkAndRemoveSelectAnimationOption(): void {
    if (this.animationNames.includes("Select Animation")) {
      const select = this.uiCreator.getAnimationSelect();
      const optionToRemove = Array.from(select.options).find(option => option.value === "Select Animation");
      if (optionToRemove) {
        select.remove(optionToRemove.index);
      }
    }
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

  private bindVisibilityHandler(): void {
    const visibilityCheckbox = this.uiCreator.getVisibilityCheckbox();
    visibilityCheckbox.checked = this.spine.visible;
    visibilityCheckbox.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      this.spine.visible = target.checked;
    });
  }

  private bindAlphaHandler(): void {
    const alphaInput = this.uiCreator.getAlphaInput();
    alphaInput.value = this.spine.alpha.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    alphaInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const alphaValue = Number.parseFloat(target.value);
      if (Number.isNaN(alphaValue)) {
        return;
      }
      const clampedAlpha = Math.max(0, Math.min(1, alphaValue));
      this.spine.alpha = clampedAlpha;
      target.value = clampedAlpha.toString();
    });
  }

  private bindAnimationSpeedHandler(): void {
    const speedInput = this.uiCreator.getAnimationSpeedInput();
    speedInput.value = this.spine.state.timeScale.toString();
    speedInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const speed = Math.round(Number.parseFloat(target.value) * 10) / 10;
      this.handleAnimationSpeedChange(speed);
    });
  }

  private handleAnimationSpeedChange(speed: number): void {
    const speedInput = this.uiCreator.getAnimationSpeedInput();
    speedInput.value = speed.toString();
    this.spine.state.timeScale = speed;
    const speedValueLabel = this.uiCreator.getAnimationSpeedValueLabel();
    speedValueLabel.textContent = `${speed}x`;
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
    xPositionInput.value = this.spine.x.toFixed(2);
    yPositionInput.value = this.spine.y.toFixed(2);
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
    scaleXInput.value = this.spine.scale.x.toFixed(2);
    scaleYInput.value = this.spine.scale.y.toFixed(2);
  }

  private bindResetPositionHandler(): void {
    const resetPositionButton = this.uiCreator.getResetPositionButton();
    resetPositionButton.addEventListener("click", () => {
      const app = (globalThis as any).__PIXI_APP__;
      const centerX = app.canvas.width / 2;
      const centerY = app.canvas.height / 2;
      this.spine.x = centerX;
      this.spine.y = centerY;
      this.updatePositionInputs();
    });
  }

  private bindResetScaleHandler(): void {
    const resetScaleButton = this.uiCreator.getResetScaleButton();
    resetScaleButton.addEventListener("click", () => {
      this.spine.scale.set(1, 1);
      this.updateScaleInputs();
    });
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

  private bindDestroyHandler(): void {
    const destroyButton = this.uiCreator.getDestroyButton();
    destroyButton.addEventListener("click", () => {
      dispatchEvent(new CustomEvent("SPINE_DESTROY_REQUESTED", {
        detail: { spine: this.spine }
      }));
    });
  }

  private dispose(): void {
    removeEventListener("SPINE_POSITION_UPDATED", this.onPositionUpdated);
    removeEventListener("SPINE_SCALE_UPDATED", this.onScaleUpdated);
    removeEventListener("TOGGLE_SPINE_CONTROLLER_VISIBILITY", this.onToggleVisibility);
    removeEventListener("SPINE_DESTROY_REQUESTED", this.onDestroyRequested);
    this.uiCreator.getMainDiv().remove();
  }
}
