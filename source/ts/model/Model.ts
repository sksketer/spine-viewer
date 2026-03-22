export class Model {
  private canvasDimensions: { w: number, h: number } = {
    w: 1280,
    h: this.getCanvasHeight()
  };

  private getCanvasHeight(): number {
    const footerHeight = document.getElementById("footer")?.clientHeight ?? 0;
    const availableHeight = window.innerHeight - footerHeight;

    return Math.min(720, availableHeight);
  }

  public setCanvasDimensions(w: number, h: number): void {
    this.canvasDimensions = { w, h };
  }

  public getCanvasDimensions(): { w: number, h: number } {
    return this.canvasDimensions;
  }
}
