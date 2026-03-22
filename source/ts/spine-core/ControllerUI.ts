import { SVSpine } from "./SVSpine";

export class ControllerUI {

  private readonly spineRef: SVSpine;
  private readonly spineName: string;
  private readonly parentDiv: HTMLDivElement;
  private readonly animationNames: Array<string>;

  private mainDiv: HTMLDivElement;
  private nameDiv: HTMLDivElement;
  private animationSelect: HTMLSelectElement;
  private playPauseButton: HTMLButtonElement;
  private loopCheckbox: HTMLInputElement;
  private xPositionInput: HTMLInputElement;
  private yPositionInput: HTMLInputElement;
  private xScaleInput: HTMLInputElement;
  private yScaleInput: HTMLInputElement;

  constructor(spineRef: SVSpine, animationNames: Array<string>, parentDiv?: HTMLDivElement | string) {
    this.spineRef = spineRef;
    this.spineName = spineRef.label;
    this.animationNames = animationNames;
    if (typeof parentDiv === "string") {
      this.parentDiv = document.querySelector(parentDiv);
    } else {
      this.parentDiv = parentDiv || document.querySelector('.controllerDiv');
    }
  }

  async init(): Promise<void> {
    this.createMainDiv();
    this.nameHolder();
    this.version();
    this.animations();
    this.playOrPauseAnimation();
    this.looping();
    this.positions();
    this.scales();
  }

  createMainDiv(): void {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add("controllerMainDiv");
    this.parentDiv.appendChild(mainDiv);
    this.mainDiv = mainDiv;
  }

  version(): void {
    const versionDiv = document.createElement('div');
    versionDiv.id = 'versionHolder';
    versionDiv.textContent = `Version: ${this.spineRef.version}`;
    this.mainDiv.appendChild(versionDiv);
  }

  nameHolder(): void {
    const nameDiv = document.createElement('div');
    nameDiv.id = 'spineNameHolder';
    nameDiv.textContent = `${this.spineName.toString().toUpperCase()}`;
    this.mainDiv.appendChild(nameDiv);
    this.nameDiv = nameDiv;
  }

  animations(): void {
    const animationDiv = document.createElement('div');
    const heading = document.createElement('span');
    heading.id = "animationHeading";
    heading.textContent = "Animations: ";
    animationDiv.appendChild(heading);
    const animationSelect = document.createElement('select');
    animationSelect.id = "animationSelect";
    this.animationNames.forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.text = name;
      animationSelect.appendChild(option);
    });
    animationDiv.appendChild(animationSelect);
    this.mainDiv.appendChild(animationDiv);
    this.animationSelect = animationSelect;
  }

  looping(): void {
    const loopDiv = document.createElement('div');
    const loopLabel = document.createElement('span');
    loopLabel.textContent = "Loop: ";
    loopDiv.appendChild(loopLabel);
    const loopCheckbox = document.createElement('input');
    loopCheckbox.type = "checkbox";
    loopCheckbox.id = "loopCheckbox";
    loopDiv.appendChild(loopCheckbox);
    this.mainDiv.appendChild(loopDiv);
    this.loopCheckbox = loopCheckbox;
  }

  positions(): void {
    const positionDiv = document.createElement('div');
    // X Input
    const xInputLabel = document.createElement('span');
    xInputLabel.textContent = "X: ";
    positionDiv.appendChild(xInputLabel);
    const xInput = document.createElement('input');
    xInput.id = "xPosition";
    positionDiv.appendChild(xInput);
    // Y Input
    const yInputLabel = document.createElement('span');
    yInputLabel.textContent = "Y: ";
    positionDiv.appendChild(yInputLabel);
    const yInput = document.createElement('input');
    yInput.id = "yPosition";
    positionDiv.appendChild(yInput);

    this.mainDiv.appendChild(positionDiv);
    this.xPositionInput = xInput;
    this.yPositionInput = yInput;
  }

  scales(): void {
    const scaleDiv = document.createElement('div');
    // X Input
    const xInputLabel = document.createElement('span');
    xInputLabel.textContent = "Scale X: ";
    scaleDiv.appendChild(xInputLabel);
    const xInput = document.createElement('input');
    xInput.id = "xScale";
    scaleDiv.appendChild(xInput);
    // Y Input
    const yInputLabel = document.createElement('span');
    yInputLabel.textContent = "Scale Y: ";
    scaleDiv.appendChild(yInputLabel);
    const yInput = document.createElement('input');
    yInput.id = "yScale";
    scaleDiv.appendChild(yInput);

    this.mainDiv.appendChild(scaleDiv);
    this.xScaleInput = xInput;
    this.yScaleInput = yInput;
  }

  playOrPauseAnimation(): void {
    const playPauseDiv = document.createElement("div");
    const button = document.createElement("button");
    button.id = "playPauseButton";
    button.type = "button";
    button.textContent = "Pause";
    playPauseDiv.appendChild(button);
    this.mainDiv.appendChild(playPauseDiv);
    this.playPauseButton = button;
  }

  setPlayPauseState(isPaused: boolean): void {
    this.playPauseButton.textContent = isPaused ? "Play" : "Pause";
  }

  getNameDiv(): HTMLDivElement {
    return this.nameDiv;
  }

  getAnimationSelect(): HTMLSelectElement {
    return this.animationSelect;
  }

  getLoopCheckbox(): HTMLInputElement {
    return this.loopCheckbox;
  }

  getPlayPauseButton(): HTMLButtonElement {
    return this.playPauseButton;
  }

  getXPositionInput(): HTMLInputElement {
    return this.xPositionInput;
  }

  getYPositionInput(): HTMLInputElement {
    return this.yPositionInput;
  }

  getXScaleInput(): HTMLInputElement {
    return this.xScaleInput;
  }

  getYScaleInput(): HTMLInputElement {
    return this.yScaleInput;
  }

  getMainDiv(): HTMLDivElement {
    return this.mainDiv;
  }
}