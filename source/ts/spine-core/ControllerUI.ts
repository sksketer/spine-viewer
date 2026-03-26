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
  private visibilityCheckbox: HTMLInputElement;
  private alphaInput: HTMLInputElement;
  private animationSpeedInput: HTMLInputElement;
  private animationSpeedValueLabel: HTMLSpanElement;
  private destroyButton: HTMLButtonElement;
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

  init(): void {
    this.createMainDiv();
    this.nameHolder();
    this.version();
    this.animations();
    this.playOrPauseAnimation();
    this.looping();
    this.visibility();
    this.alpha();
    this.animationSpeed();
    this.positions();
    this.scales();
    this.destroy();
  }

  createMainDiv(): void {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add("controllerMainDiv");
    mainDiv.id = `controller-${this.spineName.toLowerCase()}`;
    this.parentDiv.appendChild(mainDiv);
    this.mainDiv = mainDiv;
  }

  version(): void {
    const versionDiv = document.createElement('div');
    versionDiv.classList.add('versionHolder');
    versionDiv.textContent = `Version: ${this.spineRef.version}`;
    this.mainDiv.appendChild(versionDiv);
  }

  nameHolder(): void {
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('spineNameHolder');
    nameDiv.textContent = `${this.spineName.toString().toUpperCase().replaceAll('_', " ")}`;
    this.mainDiv.appendChild(nameDiv);
    this.nameDiv = nameDiv;
  }

  animations(): void {
    const animationDiv = document.createElement('div');
    const heading = document.createElement('span');
    heading.classList.add("animationHeading");
    heading.textContent = "Animations: ";
    animationDiv.appendChild(heading);
    const animationSelect = document.createElement('select');
    animationSelect.classList.add("animationSelect");
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
    loopCheckbox.classList.add("loopCheckbox");
    loopDiv.appendChild(loopCheckbox);
    this.mainDiv.appendChild(loopDiv);
    this.loopCheckbox = loopCheckbox;
  }

  visibility(): void {
    const visibilityDiv = document.createElement('div');
    const visibilityLabel = document.createElement('span');
    visibilityLabel.textContent = "Visible: ";
    visibilityDiv.appendChild(visibilityLabel);
    const visibilityCheckbox = document.createElement('input');
    visibilityCheckbox.type = "checkbox";
    visibilityCheckbox.checked = true;
    visibilityCheckbox.classList.add("visibilityCheckbox");
    visibilityDiv.appendChild(visibilityCheckbox);
    this.mainDiv.appendChild(visibilityDiv);
    this.visibilityCheckbox = visibilityCheckbox;
  }

  alpha(): void {
    const alphaDiv = document.createElement('div');
    const alphaLabel = document.createElement('span');
    alphaLabel.textContent = "Alpha: ";
    alphaDiv.appendChild(alphaLabel);
    const alphaInput = document.createElement('input');
    alphaInput.type = "number";
    alphaInput.min = "0";
    alphaInput.max = "1";
    alphaInput.step = "0.05";
    alphaInput.value = "1";
    alphaInput.classList.add("alphaInput");
    alphaDiv.appendChild(alphaInput);
    this.mainDiv.appendChild(alphaDiv);
    this.alphaInput = alphaInput;
  }

  animationSpeed(): void {
    const speedDiv = document.createElement('div');
    const speedLabel = document.createElement('span');
    speedLabel.textContent = "Animation Speed: ";
    speedDiv.appendChild(speedLabel);
    const speedInput = document.createElement('input');
    speedInput.type = "range";
    speedInput.min = "0.1";
    speedInput.step = "0.1";
    speedInput.value = "1";
    speedInput.max = "5";
    speedInput.classList.add("animationSpeedInput");
    const speedValueLabel = document.createElement('span');
    speedValueLabel.classList.add("speedValueLabel");
    speedValueLabel.textContent = "1.0x";
    speedDiv.appendChild(speedInput);
    speedDiv.appendChild(speedValueLabel);
    this.mainDiv.appendChild(speedDiv);
    this.animationSpeedInput = speedInput;
    this.animationSpeedValueLabel = speedValueLabel;
  }

  positions(): void {
    const positionDiv = document.createElement('div');
    positionDiv.classList.add("positionGroup");

    const xRow = document.createElement("div");
    xRow.classList.add("controllerFieldRow");
    const xInputLabel = document.createElement('span');
    xInputLabel.textContent = "X: ";
    xRow.appendChild(xInputLabel);
    const xInput = document.createElement('input');
    xInput.classList.add("xPosition");
    xRow.appendChild(xInput);
    positionDiv.appendChild(xRow);

    const yRow = document.createElement("div");
    yRow.classList.add("controllerFieldRow");
    const yInputLabel = document.createElement('span');
    yInputLabel.textContent = "Y: ";
    yRow.appendChild(yInputLabel);
    const yInput = document.createElement('input');
    yInput.classList.add("yPosition");
    yRow.appendChild(yInput);
    positionDiv.appendChild(yRow);

    this.mainDiv.appendChild(positionDiv);
    this.xPositionInput = xInput;
    this.yPositionInput = yInput;
  }

  scales(): void {
    const scaleDiv = document.createElement('div');
    scaleDiv.classList.add("scaleGroup");

    const scaleXRow = document.createElement("div");
    scaleXRow.classList.add("controllerFieldRow");
    const xInputLabel = document.createElement('span');
    xInputLabel.textContent = "Scale X: ";
    scaleXRow.appendChild(xInputLabel);
    const xInput = document.createElement('input');
    xInput.classList.add("xScale");
    scaleXRow.appendChild(xInput);
    scaleDiv.appendChild(scaleXRow);

    const scaleYRow = document.createElement("div");
    scaleYRow.classList.add("controllerFieldRow");
    const yInputLabel = document.createElement('span');
    yInputLabel.textContent = "Scale Y: ";
    scaleYRow.appendChild(yInputLabel);
    const yInput = document.createElement('input');
    yInput.classList.add("yScale");
    scaleYRow.appendChild(yInput);
    scaleDiv.appendChild(scaleYRow);

    this.mainDiv.appendChild(scaleDiv);
    this.xScaleInput = xInput;
    this.yScaleInput = yInput;
  }

  playOrPauseAnimation(): void {
    const playPauseDiv = document.createElement("div");
    const button = document.createElement("button");
    button.classList.add("playPauseButton");
    button.type = "button";
    button.textContent = "Pause";
    playPauseDiv.appendChild(button);
    this.mainDiv.appendChild(playPauseDiv);
    this.playPauseButton = button;
  }

  destroy(): void {
    const destroyDiv = document.createElement("div");
    const button = document.createElement("button");
    button.classList.add("destroyButton");
    button.type = "button";
    button.textContent = "Destroy";
    destroyDiv.appendChild(button);
    this.mainDiv.appendChild(destroyDiv);
    this.destroyButton = button;
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

  getVisibilityCheckbox(): HTMLInputElement {
    return this.visibilityCheckbox;
  }

  getAlphaInput(): HTMLInputElement {
    return this.alphaInput;
  }

  getAnimationSpeedInput(): HTMLInputElement {
    return this.animationSpeedInput;
  }

  getAnimationSpeedValueLabel(): HTMLSpanElement {
    return this.animationSpeedValueLabel;
  }

  getPlayPauseButton(): HTMLButtonElement {
    return this.playPauseButton;
  }

  getDestroyButton(): HTMLButtonElement {
    return this.destroyButton;
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