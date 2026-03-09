export class UIManager {
  private isFirstLoad = false;
  private canvasWidthInput: HTMLInputElement;
  private canvasHeightInput: HTMLInputElement;

  constructor() {
    this.bindEvents();
    this.initializeElements();
  }

  initializeElements(): void {
    this.canvasWidthInput = document.getElementById("canvasWidth") as HTMLInputElement;
    this.canvasHeightInput = document.getElementById("canvasHeight") as HTMLInputElement;
  }

  bindEvents(): void {
    addEventListener("spineAssetsLoaded", (e: Event) => {
      !this.isFirstLoad && this.hideFirstLoadData();
    });
    addEventListener("SCENE_READY", (e: Event) => {
      const { canvasWidth, canvasHeight } = (e as any).detail;
      this.canvasWidthInput.value = canvasWidth;
      this.canvasHeightInput.value = canvasHeight;
      this.canvasWidthInput.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const canvas = spineViewer.stage.canvas;
        canvas.style.width = `${Number.parseInt(target.value)}px`;
      });
      this.canvasHeightInput.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const canvas = spineViewer.stage.canvas;
        canvas.style.height = `${Number.parseInt(target.value)}px`;});
    });
  }

  hideFirstLoadData(): void {
    this.isFirstLoad = true;

    const uploadContainer: any = document.getElementsByClassName("upload-container")[0];
    uploadContainer.style.display = "none";

    const spineStage: any = document.getElementsByClassName("spineStage")[0];
    spineStage.style.display = "flex";
    const stage: any = document.getElementById("stage");
    stage.style.width = innerWidth / 2;
    stage.style.height = innerHeight;
  }
}