export class UIManager {
  private isFirstLoad = false;

  constructor() {
    this.bindEvents();
  }

  bindEvents(): void {
    addEventListener("spineAssetsLoaded", (e: Event) => {
      !this.isFirstLoad && this.hideFirstLoadData();
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