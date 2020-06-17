import { IRenderer } from './IRenderer';
import { Cell } from '../Grid/Cell';
import { CellTypes } from '../Grid/Cell-Types';

export class TextRenderer implements IRenderer {
    constructor(config: any) {
        if (config) {
            console.log(config);
        }
    }
    Draw(points: Array<Array<Cell>>): void {
        for (const row of points) {
            let currentLine: string = '';
            for (const point of row) {
                if (point.Type === CellTypes.Victory) {
                    currentLine += '+';
                } else if (point.Type === CellTypes.Defeat) {
                    currentLine += '-';
                } else if (point.Type === CellTypes.BattleGround) {
                    currentLine += '?';
                } else {
                    currentLine += '|';
                }
            }
            console.log(currentLine);
        }
    }
}
