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

    // Animation Section
    this.createSectionDivider();
    this.animations();

    // Playback Section
    this.createSectionDivider();
    this.playOrPauseAnimation();
    this.toggleOptions();
    this.animationSpeed();

    // Visual Section
    this.createSectionDivider();
    this.alpha();

    // Transform Section
    this.createSectionDivider();
    this.resetButtons();

    // Actions Section
    this.createSectionDivider();
    this.destroy();
  }

  createSectionDivider(): void {
    const divider = document.createElement('div');
    divider.classList.add('sectionDivider');
    this.mainDiv.appendChild(divider);
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
    animationDiv.classList.add('animationSection');
    const heading = document.createElement('span');
    heading.classList.add("animationHeading");
    heading.textContent = "Animation:";
    animationDiv.appendChild(heading);
    const animationSelect = document.createElement('select');
    animationSelect.classList.add("animationSelect");

    // Add placeholder option
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "-- Select Animation --";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    animationSelect.appendChild(placeholderOption);

    this.animationNames.forEach(name => {
      if (name !== "Select Animation") {
        const option = document.createElement("option");
        option.value = name;
        option.text = name;
        animationSelect.appendChild(option);
      }
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
    alphaDiv.classList.add('sliderRow');
    const alphaLabel = document.createElement('span');
    alphaLabel.classList.add('sliderLabel');
    alphaLabel.textContent = "Alpha:";
    alphaDiv.appendChild(alphaLabel);

    const sliderWrapper = document.createElement('div');
    sliderWrapper.classList.add('sliderWrapper');

    const alphaInput = document.createElement('input');
    alphaInput.type = "range";
    alphaInput.min = "0";
    alphaInput.max = "1";
    alphaInput.step = "0.05";
    alphaInput.value = "1";
    alphaInput.classList.add("alphaInput", "sliderInput");

    const tooltip = document.createElement('div');
    tooltip.classList.add('sliderTooltip');
    tooltip.textContent = "100%";

    sliderWrapper.appendChild(alphaInput);
    sliderWrapper.appendChild(tooltip);
    alphaDiv.appendChild(sliderWrapper);

    const alphaValueLabel = document.createElement('span');
    alphaValueLabel.classList.add("alphaValueLabel", "sliderValue");
    alphaValueLabel.textContent = "100%";
    alphaDiv.appendChild(alphaValueLabel);

    // Tooltip positioning on input
    alphaInput.addEventListener('input', () => {
      const val = Number.parseFloat(alphaInput.value);
      const percent = Math.round(val * 100);
      tooltip.textContent = `${percent}%`;
      this.updateTooltipPosition(alphaInput, tooltip);
    });
    alphaInput.addEventListener('mousedown', () => tooltip.classList.add('visible'));
    alphaInput.addEventListener('mouseup', () => tooltip.classList.remove('visible'));
    alphaInput.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));

    this.mainDiv.appendChild(alphaDiv);
    this.alphaInput = alphaInput;
    this.alphaValueLabel = alphaValueLabel;
  }

  private updateTooltipPosition(input: HTMLInputElement, tooltip: HTMLElement): void {
    const min = Number.parseFloat(input.min);
    const max = Number.parseFloat(input.max);
    const val = Number.parseFloat(input.value);
    const percent = (val - min) / (max - min);
    const thumbWidth = 16;
    const inputWidth = input.offsetWidth;
    const left = percent * (inputWidth - thumbWidth) + thumbWidth / 2;
    tooltip.style.left = `${left}px`;
  }

  animationSpeed(): void {
    const speedDiv = document.createElement('div');
    speedDiv.classList.add('sliderRow');
    const speedLabel = document.createElement('span');
    speedLabel.classList.add('sliderLabel');
    speedLabel.textContent = "Speed:";
    speedDiv.appendChild(speedLabel);

    const sliderWrapper = document.createElement('div');
    sliderWrapper.classList.add('sliderWrapper');

    const speedInput = document.createElement('input');
    speedInput.type = "range";
    speedInput.min = "0.1";
    speedInput.step = "0.1";
    speedInput.value = "1";
    speedInput.max = "5";
    speedInput.classList.add("animationSpeedInput", "sliderInput");

    const tooltip = document.createElement('div');
    tooltip.classList.add('sliderTooltip');
    tooltip.textContent = "1.0x";

    sliderWrapper.appendChild(speedInput);
    sliderWrapper.appendChild(tooltip);
    speedDiv.appendChild(sliderWrapper);

    const speedValueLabel = document.createElement('span');
    speedValueLabel.classList.add("speedValueLabel", "sliderValue");
    speedValueLabel.textContent = "1.0x";
    speedDiv.appendChild(speedValueLabel);

    // Tooltip positioning on input
    speedInput.addEventListener('input', () => {
      const val = Number.parseFloat(speedInput.value);
      tooltip.textContent = `${val.toFixed(1)}x`;
      this.updateTooltipPosition(speedInput, tooltip);
    });
    speedInput.addEventListener('mousedown', () => tooltip.classList.add('visible'));
    speedInput.addEventListener('mouseup', () => tooltip.classList.remove('visible'));
    speedInput.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));

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
    destroyDiv.classList.add("destroySection");
    const button = document.createElement("button");
    button.classList.add("destroyButton");
    button.type = "button";
    button.textContent = "Destroy";

    // Add confirmation on click
    button.addEventListener('click', (e) => {
      if (!button.classList.contains('confirm-mode')) {
        e.stopImmediatePropagation();
        button.classList.add('confirm-mode');
        button.textContent = "Click to Confirm";

        // Reset after 3 seconds
        setTimeout(() => {
          button.classList.remove('confirm-mode');
          button.textContent = "Destroy";
        }, 3000);
      }
    }, true);

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