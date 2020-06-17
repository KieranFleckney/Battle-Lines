import { Point } from './Point';

export interface IRenderer {
    Draw(points: Array<Array<Point>>): void;
    SetGridParameters(
        rows: number,
        columns: number,
        height: number,
        width: number,
        pointSize: number,
        battleFieldSize: number
    ): void;
}
