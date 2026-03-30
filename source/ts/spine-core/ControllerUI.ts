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
  private alphaInput: HTMLInputElement;
  private alphaValueLabel: HTMLSpanElement;
  private animationSpeedInput: HTMLInputElement;
  private animationSpeedValueLabel: HTMLSpanElement;
  private destroyButton: HTMLButtonElement;
  private resetPositionButton: HTMLButtonElement;
  private resetScaleButton: HTMLButtonElement;

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
    this.toggleOptions();
    this.alpha();
    this.animationSpeed();
    this.resetButtons();
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
    this.animationNames.unshift("Select Animation");
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

  toggleOptions(): void {
    const togglesDiv = document.createElement('div');
    togglesDiv.classList.add("toggleOptionsRow");

    const loopDiv = document.createElement('div');
    loopDiv.classList.add("toggleOption");
    const loopLabel = document.createElement('span');
    loopLabel.textContent = "Loop: ";
    loopDiv.appendChild(loopLabel);
    const loopCheckbox = document.createElement('input');
    loopCheckbox.type = "checkbox";
    loopCheckbox.classList.add("loopCheckbox");
    loopDiv.appendChild(loopCheckbox);
    togglesDiv.appendChild(loopDiv);

    this.mainDiv.appendChild(togglesDiv);

    this.loopCheckbox = loopCheckbox;
  }

  alpha(): void {
    const alphaDiv = document.createElement('div');
    const alphaLabel = document.createElement('span');
    alphaLabel.textContent = "Alpha: ";
    alphaDiv.appendChild(alphaLabel);
    const alphaInput = document.createElement('input');
    alphaInput.type = "range";
    alphaInput.min = "0";
    alphaInput.max = "1";
    alphaInput.step = "0.05";
    alphaInput.value = "1";
    alphaInput.classList.add("alphaInput");
    const alphaValueLabel = document.createElement('span');
    alphaValueLabel.classList.add("alphaValueLabel");
    alphaValueLabel.textContent = "100%";
    alphaDiv.appendChild(alphaInput);
    alphaDiv.appendChild(alphaValueLabel);
    this.mainDiv.appendChild(alphaDiv);
    this.alphaInput = alphaInput;
    this.alphaValueLabel = alphaValueLabel;
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

  resetButtons(): void {
    const resetDiv = document.createElement('div');
    resetDiv.classList.add("resetButtonsRow");

    const resetPositionButton = document.createElement('button');
    resetPositionButton.type = "button";
    resetPositionButton.classList.add("resetPositionButton");
    resetPositionButton.textContent = "Reset Position";
    resetDiv.appendChild(resetPositionButton);

    const resetScaleButton = document.createElement('button');
    resetScaleButton.type = "button";
    resetScaleButton.classList.add("resetScaleButton");
    resetScaleButton.textContent = "Reset Scale";
    resetDiv.appendChild(resetScaleButton);

    this.mainDiv.appendChild(resetDiv);
    this.resetPositionButton = resetPositionButton;
    this.resetScaleButton = resetScaleButton;
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

  getAlphaInput(): HTMLInputElement {
    return this.alphaInput;
  }

  getAlphaValueLabel(): HTMLSpanElement {
    return this.alphaValueLabel;
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

  getMainDiv(): HTMLDivElement {
    return this.mainDiv;
  }

  getResetPositionButton(): HTMLButtonElement {
    return this.resetPositionButton;
  }

  getResetScaleButton(): HTMLButtonElement {
    return this.resetScaleButton;
  }
}