import { IRenderer } from './IRenderer';
import { Point } from './Point';
import { PointTypes } from './Point-Types';
import { IsOdd } from './Utilities';

export class CanvasRenderer implements IRenderer {
    Canvas: HTMLCanvasElement;
    ColourOne: string;
    ColourTwo: string;
    Rows: number;
    Columns: number;
    Height: number;
    Width: number;
    PointSize: number;
    BattleFieldSize: number;
    constructor(canvas: HTMLCanvasElement, colourOne: string, colourTwo: string) {
        this.Canvas = canvas;
        this.ColourOne = colourOne;
        this.ColourTwo = colourTwo;
        this.Rows = 0;
        this.Columns = 0;
        this.Height = 0;
        this.Width = 0;
        this.PointSize = 0;
        this.BattleFieldSize = 0;
    }

    Draw(points: Array<Array<Point>>): void {
        this.Canvas.height = this.Height;
        this.Canvas.width = this.Width;
        this.Canvas.style.backgroundColor = this.ColourTwo;
        let ctx: CanvasRenderingContext2D | null = this.Canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = this.ColourOne;
            let currentHeight: number = 0;
            for (const row of points) {
                let currentWidth: number = 0;

                for (let index = 0; index < row.length; index++) {
                    let point: Point = row[index];
                    switch (point.Type) {
                        case PointTypes.Attacker:
                        case PointTypes.Victory:
                            if (IsOdd(point.Y)) {
                                this.DrawOdd(ctx, currentWidth, currentHeight, row, index);
                            } else {
                                this.DrawEven(ctx, currentWidth, currentHeight, row, index);
                            }
                            break;
                        default:
                            break;
                    }
                    currentWidth += this.PointSize;
                }
                currentWidth = 0;
                currentHeight += this.PointSize;
            }
        }
    }

    private DrawOdd(
        ctx: CanvasRenderingContext2D,
        currentWidth: number,
        currentHeight: number,
        row: Array<Point>,
        index: number
    ): void {
        if (
            (!row[index - 1] && this.IsFriendly(row[index + 1])) ||
            (this.IsFriendly(row[index - 1]) && !row[index + 1])
        ) {
            this.DrawSquare(ctx, currentWidth, currentHeight);
        } else if (this.IsFriendly(row[index - 1]) && this.IsFriendly(row[index + 1])) {
            this.DrawSquare(ctx, currentWidth, currentHeight);
        } else if (this.IsEnemy(row[index - 1]) && this.IsEnemy(row[index + 1])) {
            this.DrawCircle(ctx, currentWidth, currentHeight);
        } else if (this.IsFriendly(row[index - 1]) && this.IsEnemy(row[index + 1])) {
            this.DrawRightOuterCurve(ctx, currentWidth, currentHeight);
        } else if (this.IsEnemy(row[index - 1]) && this.IsFriendly(row[index + 1])) {
            this.DrawLeftOuterCurve(ctx, currentWidth, currentHeight);
        }
    }

    private DrawEven(
        ctx: CanvasRenderingContext2D,
        currentWidth: number,
        currentHeight: number,
        row: Array<Point>,
        index: number
    ): void {
        if (
            (!row[index - 1] && this.IsFriendly(row[index + 1])) ||
            (this.IsFriendly(row[index - 1]) && !row[index + 1])
        ) {
            this.DrawSquare(ctx, currentWidth, currentHeight);
        } else if (this.IsFriendly(row[index - 1]) && this.IsFriendly(row[index + 1])) {
            this.DrawSquare(ctx, currentWidth, currentHeight);
        } else if (this.IsEnemy(row[index - 1]) && this.IsEnemy(row[index + 1])) {
            this.DrawInny(ctx, currentWidth, currentHeight);
        } else if (this.IsFriendly(row[index - 1]) && this.IsEnemy(row[index + 1])) {
            this.DrawRightInnerCurve(ctx, currentWidth, currentHeight);
        } else if (this.IsEnemy(row[index - 1]) && this.IsFriendly(row[index + 1])) {
            this.DrawLeftInnerCurve(ctx, currentWidth, currentHeight);
        }
    }

    private DrawCircle(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.PointSize / 2;
        ctx.beginPath();
        ctx.strokeStyle = this.ColourOne;
        ctx.arc(currentWidth + radius, currentHeight + radius, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    private DrawSquare(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        ctx.beginPath();
        ctx.strokeStyle = this.ColourOne;
        ctx.rect(currentWidth, currentHeight, this.PointSize, this.PointSize);
        ctx.fill();
    }

    private DrawLeftOuterCurve(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.PointSize / 2;
        ctx.beginPath();
        ctx.moveTo(currentWidth + this.PointSize, currentHeight);
        ctx.lineTo(currentWidth + radius, currentHeight);
        ctx.arc(currentWidth + radius, currentHeight + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
        ctx.lineTo(currentWidth + this.PointSize, currentHeight + this.PointSize);
        ctx.lineTo(currentWidth + this.PointSize, currentHeight);
        ctx.fill();
    }

    private DrawRightOuterCurve(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.PointSize / 2;
        ctx.beginPath();
        ctx.moveTo(currentWidth, currentHeight);
        ctx.lineTo(currentWidth + radius, currentHeight);
        ctx.arc(currentWidth + radius, currentHeight + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, false);
        ctx.lineTo(currentWidth, currentHeight + this.PointSize);
        ctx.lineTo(currentWidth, currentHeight);
        ctx.fill();
    }

    private DrawInny(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.PointSize / 2;
        let tenth: number = this.PointSize / 10;
        ctx.beginPath();
        ctx.moveTo(currentWidth, currentHeight);
        ctx.lineTo(currentWidth + this.PointSize, currentHeight);
        ctx.arc(
            currentWidth + this.PointSize + tenth,
            currentHeight + radius,
            radius,
            1.5 * Math.PI,
            0.5 * Math.PI,
            true
        );
        ctx.lineTo(currentWidth, currentHeight + this.PointSize);
        ctx.arc(currentWidth - tenth, currentHeight + radius, radius, 0.5 * Math.PI, 1.5 * Math.PI, true);
        ctx.fill();
    }

    private DrawRightInnerCurve(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.PointSize / 2;
        ctx.beginPath();
        ctx.moveTo(currentWidth, currentHeight);
        ctx.lineTo(currentWidth + this.PointSize, currentHeight);
        ctx.arc(currentWidth + this.PointSize, currentHeight + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
        ctx.lineTo(currentWidth, currentHeight + this.PointSize);
        ctx.lineTo(currentWidth, currentHeight);
        ctx.fill();
    }

    private DrawLeftInnerCurve(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.PointSize / 2;
        ctx.beginPath();
        ctx.moveTo(currentWidth, currentHeight);
        ctx.lineTo(currentWidth + this.PointSize, currentHeight);
        ctx.lineTo(currentWidth + this.PointSize, currentHeight + this.PointSize);
        ctx.lineTo(currentWidth, currentHeight + this.PointSize);
        ctx.arc(currentWidth, currentHeight + radius, radius, 0.5 * Math.PI, 1.5 * Math.PI, true);
        ctx.fill();
    }

    private IsFriendly(point: Point): boolean {
        let answer: boolean = false;
        if (point.Type === PointTypes.Attacker || point.Type === PointTypes.Victory) answer = true;
        return answer;
    }

    private IsEnemy(point: Point): boolean {
        let answer: boolean = false;
        if (point.Type === PointTypes.Defender || point.Type === PointTypes.Defeat) answer = true;
        return answer;
    }

    SetGridParameters(
        rows: number,
        columns: number,
        height: number,
        width: number,
        pointSize: number,
        battleFieldSize: number
    ): void {
        this.Rows = rows;
        this.Columns = columns;
        this.Height = height;
        this.Width = width;
        this.PointSize = pointSize;
        this.BattleFieldSize = battleFieldSize;
    }
}
