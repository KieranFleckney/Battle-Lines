import { IRenderer } from './IRenderer';
import { Cell } from '../Grid/Cell';
import { CellTypes } from '../Grid/Cell-Types';
import { IsOdd, SeedRand } from '../Utilities/Utilities';

export class CanvasRenderer implements IRenderer {
    Random: SeedRand;
    Height: number;
    Width: number;
    CellSize: number;

    Canvas: HTMLCanvasElement;
    ColourOne: string;
    ColourTwo: string;

    /**
     * Renderers pattern to the give canvas
     * @param config
     */
    constructor(config: any) {
        this.Random = config.Random;
        this.Height = config.Height;
        this.Width = config.Width;
        this.CellSize = config.CellSize;

        if (!config.Canvas) throw new Error('Missing "Canvas"');
        this.Canvas = config.Canvas;

        if (!config.ColourOne) throw new Error('Missing "ColourOne"');
        this.ColourOne = config.ColourOne;

        if (!config.ColourTwo) throw new Error('Missing "ColourTwo"');
        this.ColourTwo = config.ColourTwo;
    }

    /**
     * Draw Pattern on canvas
     * @param points
     */
    Draw(points: Array<Array<Cell>>): void {
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
                    let point: Cell = row[index];
                    switch (point.Type) {
                        case CellTypes.Victory:
                            if (IsOdd(point.Y)) {
                                this.DrawOdd(ctx, currentWidth, currentHeight, row, index);
                            } else {
                                this.DrawEven(ctx, currentWidth, currentHeight, row, index);
                            }
                            break;
                        default:
                            break;
                    }
                    currentWidth += this.CellSize;
                }
                currentWidth = 0;
                currentHeight += this.CellSize;
            }
        }
    }

    private DrawOdd(
        ctx: CanvasRenderingContext2D,
        currentWidth: number,
        currentHeight: number,
        row: Array<Cell>,
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
        row: Array<Cell>,
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
        let radius: number = this.CellSize / 2;
        ctx.beginPath();
        ctx.strokeStyle = this.ColourOne;
        ctx.arc(currentWidth + radius, currentHeight + radius, radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    private DrawSquare(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        ctx.beginPath();
        ctx.strokeStyle = this.ColourOne;
        ctx.rect(currentWidth, currentHeight, this.CellSize, this.CellSize);
        ctx.fill();
    }

    private DrawLeftOuterCurve(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.CellSize / 2;
        ctx.beginPath();
        ctx.moveTo(currentWidth + this.CellSize, currentHeight);
        ctx.lineTo(currentWidth + radius, currentHeight);
        ctx.arc(currentWidth + radius, currentHeight + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
        ctx.lineTo(currentWidth + this.CellSize, currentHeight + this.CellSize);
        ctx.lineTo(currentWidth + this.CellSize, currentHeight);
        ctx.fill();
    }

    private DrawRightOuterCurve(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.CellSize / 2;
        ctx.beginPath();
        ctx.moveTo(currentWidth, currentHeight);
        ctx.lineTo(currentWidth + radius, currentHeight);
        ctx.arc(currentWidth + radius, currentHeight + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, false);
        ctx.lineTo(currentWidth, currentHeight + this.CellSize);
        ctx.lineTo(currentWidth, currentHeight);
        ctx.fill();
    }

    private DrawInny(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.CellSize / 2;
        let tenth: number = this.CellSize / 10;
        ctx.beginPath();
        ctx.moveTo(currentWidth, currentHeight);
        ctx.lineTo(currentWidth + this.CellSize, currentHeight);
        ctx.arc(
            currentWidth + this.CellSize + tenth,
            currentHeight + radius,
            radius,
            1.5 * Math.PI,
            0.5 * Math.PI,
            true
        );
        ctx.lineTo(currentWidth, currentHeight + this.CellSize);
        ctx.arc(currentWidth - tenth, currentHeight + radius, radius, 0.5 * Math.PI, 1.5 * Math.PI, true);
        ctx.fill();
    }

    private DrawRightInnerCurve(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.CellSize / 2;
        ctx.beginPath();
        ctx.moveTo(currentWidth, currentHeight);
        ctx.lineTo(currentWidth + this.CellSize, currentHeight);
        ctx.arc(currentWidth + this.CellSize, currentHeight + radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, true);
        ctx.lineTo(currentWidth, currentHeight + this.CellSize);
        ctx.lineTo(currentWidth, currentHeight);
        ctx.fill();
    }

    private DrawLeftInnerCurve(ctx: CanvasRenderingContext2D, currentWidth: number, currentHeight: number): void {
        let radius: number = this.CellSize / 2;
        ctx.beginPath();
        ctx.moveTo(currentWidth, currentHeight);
        ctx.lineTo(currentWidth + this.CellSize, currentHeight);
        ctx.lineTo(currentWidth + this.CellSize, currentHeight + this.CellSize);
        ctx.lineTo(currentWidth, currentHeight + this.CellSize);
        ctx.arc(currentWidth, currentHeight + radius, radius, 0.5 * Math.PI, 1.5 * Math.PI, true);
        ctx.fill();
    }

    private IsFriendly(point: Cell): boolean {
        let answer: boolean = false;
        if (point.Type === CellTypes.Victory) answer = true;
        return answer;
    }

    private IsEnemy(point: Cell): boolean {
        let answer: boolean = false;
        if (point.Type === CellTypes.Defeat) answer = true;
        return answer;
    }
}
