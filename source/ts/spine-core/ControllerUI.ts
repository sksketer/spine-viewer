export class ControllerUI {

  private readonly spineName: string;
  private readonly parentDiv: HTMLDivElement;
  private readonly animationNames: Array<string>;

  private mainDiv: HTMLDivElement;
  private nameDiv: HTMLDivElement;
  private animationSelect: HTMLSelectElement;
  private loopCheckbox: HTMLInputElement;
  private xPositionInput: HTMLInputElement;
  private yPositionInput: HTMLInputElement;
  private xScaleInput: HTMLInputElement;
  private yScaleInput: HTMLInputElement;

  constructor(spineName: string, animationNames: Array<string>, parentDiv?: HTMLDivElement | string) {
    this.spineName = spineName;
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
    this.animations();
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

  getNameDiv(): HTMLDivElement {
    return this.nameDiv;
  }

  getAnimationSelect(): HTMLSelectElement {
    return this.animationSelect;
  }

  getLoopCheckbox(): HTMLInputElement {
    return this.loopCheckbox;
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