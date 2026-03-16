export class Model {
  private canvasDimensions: { w: number, h: number } = {
    w: 1280,
    h: innerHeight - (document.getElementById("footer")?.clientHeight ?? 0)
  };

  public setCanvasDimensions(w: number, h: number): void {
    this.canvasDimensions = { w, h };
  }

  public getCanvasDimensions(): { w: number, h: number } {
    return this.canvasDimensions;
  }
}