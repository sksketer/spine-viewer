export class Model {
    private canvasDimension: { width: number, height: number } = {
        width: innerWidth * 0.75,
        height: innerHeight - (document.getElementById("footer")?.clientHeight ?? 0)
    };

    public setCanvasDimension(newDimension: { width: number, height: number }): void {
        this.canvasDimension.width = newDimension.width;
        this.canvasDimension.height = newDimension.height;
    }

    public getCanvasDimension(): { width: number, height: number } {
        return this.canvasDimension;
    }
}
