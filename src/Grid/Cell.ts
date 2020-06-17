import { CellTypes } from './Cell-Types';

export class Cell {
    X: number;
    Y: number;
    Type: CellTypes;
    Colour: string;

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
        this.Type = CellTypes.BattleGround;
        this.Colour = '';
    }
}
