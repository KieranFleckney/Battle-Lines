import { IRenderer } from './IRenderer';
import { Point } from './Point';
import { PointTypes } from './Point-Types';

export class TextRenderer implements IRenderer {
    Draw(points: Array<Array<Point>>): void {
        for (const row of points) {
            let currentLine: string = '';
            for (const point of row) {
                if (point.Type === PointTypes.Attacker) {
                    currentLine += '#';
                } else if (point.Type === PointTypes.Defender) {
                    currentLine += '*';
                } else if (point.Type === PointTypes.Victory) {
                    currentLine += '+';
                } else if (point.Type === PointTypes.Defeat) {
                    currentLine += '-';
                } else if (point.Type === PointTypes.BattleGround) {
                    currentLine += '?';
                } else {
                    currentLine += '|';
                }
            }
            console.log(currentLine);
        }
    }

    SetGridParameters(
        rows: number,
        columns: number,
        height: number,
        width: number,
        pointSize: number,
        battleFieldSize: number
    ): void {
        // Not needed for this renderer
        console.log('(Text Renderer) Rows: ' + rows);
        console.log('(Text Renderer) Columns: ' + columns);
        console.log('(Text Renderer) Height: ' + height);
        console.log('(Text Renderer) Width: ' + width);
        console.log('(Text Renderer) Point Size: ' + pointSize);
        console.log('(Text Renderer) Battle Field Size: ' + battleFieldSize);
    }
}
