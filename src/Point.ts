import { PointTypes } from './Point-Types';

export class Point {
    X: number;
    Y: number;
    Type: PointTypes;
    Colour: string;

    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
        this.Type = PointTypes.Defender;
        this.Colour = '';
    }
}
