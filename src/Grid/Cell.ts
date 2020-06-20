import { CellTypes } from './Cell-Types';

export class Cell {
    X: number;
    Y: number;
    Type: CellTypes;

    constructor(x: number, y: number) {
        if (x) {
            this.X = x;
        } else {
            throw new Error('X missig');
        }

        if (y) {
            this.Y = y;
        } else {
            throw new Error('Y missig');
        }

        this.Type = CellTypes.BattleGround;
    }
}
