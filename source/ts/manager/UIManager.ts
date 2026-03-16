export class UIManager {
  private isFirstLoad = false;
  private canvasWidth: HTMLInputElement;
  private canvasHeight: HTMLInputElement;

  constructor() {
    this.bindEvents();
    this.initializeElements();
  }

  initializeElements(): void {
    this.canvasWidth = document.getElementById("canvasWidth") as HTMLInputElement;
    this.canvasHeight = document.getElementById("canvasHeight") as HTMLInputElement;
  }

  bindEvents(): void {
    addEventListener("spineAssetsLoaded", (e: Event) => {
      !this.isFirstLoad && this.hideFirstLoadData();
    });
    addEventListener("SCENE_READY", () => {
      this.canvasWidth.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const width = Number.parseInt(target.value);
        const canvas: any = spineViewer.stage.canvas;
        canvas.style.width = `${width}px`;
      });
      this.canvasHeight.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const height = Number.parseInt(target.value);
        const canvas: any = spineViewer.stage.canvas;
        canvas.style.height = `${height}px`;
      });
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