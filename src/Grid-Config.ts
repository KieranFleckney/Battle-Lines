export class GridConfig {
    Width: number;
    Height: number;
    PointSize: number;
    BattleGroundSize: number;

    constructor(width: number, height: number, pointSize: number, battleGroundSize: number) {
        this.Height = height;
        this.Width = width;
        this.PointSize = pointSize;
        this.BattleGroundSize = battleGroundSize;
    }
}
