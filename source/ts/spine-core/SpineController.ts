import { SVSpine } from "./SVSpine";
import { ControllerUI } from "./ControllerUI";

export class SpineController {
  private readonly spine: SVSpine;
  private readonly animationNames: Array<string>;
  private isLooping: boolean | undefined = undefined;
  private isPaused = false;
  private uiCreator: ControllerUI;

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

  private readonly onSpineListChanged = (e: Event): void => {
    const detail = (e as CustomEvent<{ spineLabels: string[] }>).detail;
    if (!detail?.spineLabels) {
      return;
    }
    this.updateZIndexOptions(detail.spineLabels);
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
    this.bindAlphaHandler();
    this.bindAnimationSpeedHandler();
    this.bindZIndexHandler();
    this.bindResetPositionHandler();
    this.bindResetScaleHandler();
    this.bindAnimationStatus();
    this.bindDestroyHandler();
    addEventListener("TOGGLE_SPINE_CONTROLLER_VISIBILITY", this.onToggleVisibility);
    addEventListener("SPINE_DESTROY_REQUESTED", this.onDestroyRequested);
    addEventListener("SPINE_LIST_CHANGED", this.onSpineListChanged);
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

  private bindAlphaHandler(): void {
    const alphaInput = this.uiCreator.getAlphaInput();
    const alphaValueLabel = this.uiCreator.getAlphaValueLabel();
    alphaInput.value = `${this.spine.alpha.toString()}`;
    alphaValueLabel.textContent = `${(this.spine.alpha * 100).toFixed(0)}%`;
    alphaInput.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      this.spine.alpha = Number.parseFloat(target.value);
      alphaValueLabel.textContent = `${(this.spine.alpha * 100).toFixed(0)}%`;
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
    speedValueLabel.textContent = `${speed.toFixed(1)}x`;
  }

  private bindResetPositionHandler(): void {
    const resetPositionButton = this.uiCreator.getResetPositionButton();
    resetPositionButton.addEventListener("click", () => {
      const app = (globalThis as any).__PIXI_APP__;
      const centerX = app.canvas.width / 2;
      const centerY = app.canvas.height / 2;
      this.spine.x = centerX;
      this.spine.y = centerY;
    });
  }

  private bindResetScaleHandler(): void {
    const resetScaleButton = this.uiCreator.getResetScaleButton();
    resetScaleButton.addEventListener("click", () => {
      this.spine.scale.set(1, 1);
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

  private bindZIndexHandler(): void {
    const zIndexSelect = this.uiCreator.getZIndexSelect();
    zIndexSelect.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      const newIndex = Number.parseInt(target.value, 10);
      dispatchEvent(new CustomEvent("SPINE_ZINDEX_CHANGE", {
        detail: { spine: this.spine, newIndex }
      }));
    });
  }

  private updateZIndexOptions(spineLabels: string[]): void {
    const parent = this.spine.parent;
    if (!parent) return;
    const currentIndex = parent.getChildIndex(this.spine);
    this.uiCreator.updateZIndexOptions(spineLabels, currentIndex);
  }

  private dispose(): void {
    removeEventListener("TOGGLE_SPINE_CONTROLLER_VISIBILITY", this.onToggleVisibility);
    removeEventListener("SPINE_DESTROY_REQUESTED", this.onDestroyRequested);
    removeEventListener("SPINE_LIST_CHANGED", this.onSpineListChanged);
    this.uiCreator.getMainDiv().remove();
  }
}
