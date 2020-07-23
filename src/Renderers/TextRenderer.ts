import { IRenderer } from './IRenderer.js';
import { Cell } from '../Grid/Cell.js';
import { CellTypes } from '../Grid/Cell-Types.js';

export class TextRenderer implements IRenderer {
    /**
     * Renderers pattern to the console
     * Mainly used for testing
     * @param config
     */
    constructor(config: any) {
        if (config) {
            console.log(config);
        }
    }

    /**
     * Draws the patteren to the console
     * '+' = Victory
     * '-' = Defeat
     * '?' = battlefield
     * @param points
     */
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

    Export(): void {
        console.log('Nothing to export :(');
    }
}
