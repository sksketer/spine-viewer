import { SVSpine } from "./SVSpine";

export class SpineController {
  private readonly spine: SVSpine;
  private readonly animationNames: Array<string>;
  private isLooping: boolean | undefined = undefined;

  constructor(spine: SVSpine, animationName: Array<string>) {
    this.spine = spine;
    this.animationNames = animationName;
    this.init();
  }

  private init(): void {
    this.isLooping = false;
    this.updateSpineName();
    this.createAnimationSelect();
    this.bindHandlers();
  }

  private updateSpineName(): void {
    const spineNameDiv = document.getElementById("spineName") as unknown as HTMLDivElement;
    spineNameDiv.textContent = this.spine.label;
  }

  private bindHandlers(): void {
    this.bindAnimationHandler();
    this.bindLoopHandler();
    this.bindPositionHandler();
    this.bindScaleHandler();
  }

  private createAnimationSelect(): void {
    const animationNameDIV = document.getElementById("animationNameDIV") as unknown as HTMLDivElement;
    const select = document.createElement("select");
    select.id = "animationSelect";
    this.animationNames.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.text = name;
      select.appendChild(option);
    });
    animationNameDIV.appendChild(select);
  }

  private bindAnimationHandler() {
    const select = document.getElementById("animationSelect") as HTMLSelectElement;
    select.addEventListener("change", (e) => {
      const target = e.target as HTMLSelectElement;
      const animationName = target.value;
      this.spine.playAnimation(animationName, this.isLooping);
    });

  }

  private bindLoopHandler(): void {
    const loopButton = document.getElementById("loopCheckbox") as HTMLInputElement;
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
    const xPositionDiv = document.getElementById("xPos") as HTMLInputElement;
    xPositionDiv.value = this.spine.x.toString();
    xPositionDiv.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const x = Number.parseFloat(target.value) || 0;
      this.spine.x = x;
    });

    const yPositionDiv = document.getElementById("yPos") as HTMLInputElement;
    yPositionDiv.value = this.spine.y.toString();
    yPositionDiv.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const y = Number.parseFloat(target.value) || 0;
      this.spine.y = y;
    });
  }

  private bindScaleHandler(): void {
    const scaleXInput = document.getElementById("scaleX") as HTMLInputElement;
    const scaleYInput = document.getElementById("scaleY") as HTMLInputElement;

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
  }
}
