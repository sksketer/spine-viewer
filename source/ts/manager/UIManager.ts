export class UIManager {
  private isFirstLoad = false;
  private canvasWidth: HTMLInputElement;
  private canvasHeight: HTMLInputElement;
  private canvasColor: HTMLInputElement;
  private canvasSettingBtn: HTMLElement;
  private canvasController: HTMLDivElement;

  constructor() {
    this.initializeElements();
    this.bindEvents();
  }

  initializeElements(): void {
    this.canvasSettingBtn = document.getElementsByClassName("canvasSettingBtn")[0] as HTMLElement;
    this.canvasController = document.getElementsByClassName("canvasController")[0] as HTMLDivElement;
    this.canvasController.classList.remove("is-open");
    this.canvasSettingBtn.classList.remove("fa-times-circle");
    this.canvasSettingBtn.classList.add("fa-cog");
  }

  bindEvents(): void {
    addEventListener("spineAssetsLoaded", (e: Event) => {
      !this.isFirstLoad && this.hideFirstLoadData();
    });

    addEventListener("SCENE_READY", () => {
      this.canvasWidth = document.getElementById("canvasWidth") as HTMLInputElement;
      this.canvasHeight = document.getElementById("canvasHeight") as HTMLInputElement;
      this.canvasColor = document.getElementById("canvasColor") as HTMLInputElement;
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
      this.canvasColor.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        const color = Number.parseInt(target.value.replace("#", ""), 16);
        const stage: any = spineViewer.stage;
        if (stage?.renderer?.background) {
          stage.renderer.background.color = color;
        }
      });
      this.canvasColor.value = '#1099bb';
    });
    this.canvasSettingBtn.addEventListener("click", () => {
      const isOpen = this.canvasController.classList.toggle("is-open");
      this.canvasSettingBtn.classList.toggle("fa-cog", !isOpen);
      this.canvasSettingBtn.classList.toggle("fa-times-circle", isOpen);
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
