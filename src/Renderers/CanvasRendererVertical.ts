import { IRenderer } from './IRenderer';
import { Cell } from '../Grid/Cell';
import { CellTypes } from '../Grid/Cell-Types';
import {
    IsOdd,
    SeedRand,
    IsCssGradient,
    CssGradientToCanvasGradientLinear,
    AddColourStops,
    IsBrowser,
    IsNodejs,
    IsHexColour,
} from '../Utilities/Utilities';
import { CanvasRendererExportOptions } from './CanvasRendererExportOptions';

export class CanvasRendererVertical implements IRenderer {
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

        if (!points.length) throw new Error('No points');

        let ctx: CanvasRenderingContext2D | null = this.Canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, this.Width, this.Height);

            if (IsHexColour(this.ColourTwo)) {
                this.Canvas.style.backgroundColor = this.ColourTwo;
            } else if (IsCssGradient(this.ColourTwo)) {
                this.Canvas.style.backgroundImage = 'linear-gradient(' + this.ColourTwo + ')';
            } else {
                this.Canvas.style.backgroundColor = '#ffffff';
            }

            let isGradient = IsCssGradient(this.ColourOne);
            if (IsHexColour(this.ColourOne)) {
                ctx.fillStyle = this.ColourOne;
            } else {
                ctx.fillStyle = '#000000';
            }

            let currentWidth: number = 0;
            for (let c = 0; c < points[0].length; c++) {
                let currentHeight: number = 0;
                for (let r = 0; r < points.length; r++) {
                    let row: Array<Cell | undefined> = new Array<Cell | undefined>();
                    if (points[r - 1] && points[r - 1][c]) {
                        row.push(points[r - 1][c]);
                    } else {
                        row.push(undefined);
                    }

                    row.push(points[r][c]);

                    if (points[r + 1] && points[r + 1][c]) {
                        row.push(points[r + 1][c]);
                    } else {
                        row.push(undefined);
                    }

                    switch (points[r][c].Type) {
                        case CellTypes.Victory:
                            if (IsOdd(points[r][c].X)) {
                                this.DrawOdd(ctx, currentWidth, currentHeight, row);
                            } else {
                                this.DrawEven(ctx, currentWidth, currentHeight, row);
                            }
                            break;
                        default:
                            break;
                    }
                    currentHeight += this.CellSize;
                }
                currentHeight = 0;
                currentWidth += this.CellSize;
            }

            if (isGradient) {
                let gradientConfig = CssGradientToCanvasGradientLinear(
                    this.ColourOne,
                    this.Width,
                    this.Height,
                    this.Width,
                    this.Height
                );

                let gradient = ctx.createLinearGradient(
                    gradientConfig.LinearGradientParameters.X0,
                    gradientConfig.LinearGradientParameters.Y0,
                    gradientConfig.LinearGradientParameters.X1,
                    gradientConfig.LinearGradientParameters.Y1
                );

                gradient = AddColourStops(gradientConfig.ColourStops, gradient);

                ctx.setTransform(
                    gradientConfig.TransformMatrix.A,
                    gradientConfig.TransformMatrix.B,
                    gradientConfig.TransformMatrix.C,
                    gradientConfig.TransformMatrix.D,
                    gradientConfig.TransformMatrix.E,
                    gradientConfig.TransformMatrix.F
                );

                ctx.globalCompositeOperation = 'source-in';
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    gradientConfig.DrawRectParameters.X,
                    gradientConfig.DrawRectParameters.Y,
                    gradientConfig.DrawRectParameters.Width,
                    gradientConfig.DrawRectParameters.Height
                );

                ctx.setTransform(1, 0, 0, 1, 0, 0);
            }
        }
    }

    private DrawOdd(
        ctx: CanvasRenderingContext2D,
        currentWidth: number,
        currentHeight: number,
        row: Array<Cell | undefined>
    ): void {
        let cellAbove: Cell | undefined = row[0];
        let cellBelow: Cell | undefined = row[2];

        if (cellAbove && cellBelow) {
            if (this.IsFriendly(cellAbove) && this.IsFriendly(cellBelow)) {
                this.DrawSquare(ctx, currentWidth, currentHeight);
            } else if (this.IsEnemy(cellAbove) && this.IsEnemy(cellBelow)) {
                this.DrawCircle(ctx, currentWidth, currentHeight);
            } else if (this.IsFriendly(cellAbove) && this.IsEnemy(cellBelow)) {
                this.DrawRightOuterCurve(ctx, currentWidth, currentHeight);
            } else if (this.IsEnemy(cellAbove) && this.IsFriendly(cellBelow)) {
                this.DrawLeftOuterCurve(ctx, currentWidth, currentHeight);
            }
        } else {
            if (
                (!cellAbove && cellBelow && this.IsFriendly(cellBelow)) ||
                (!cellBelow && cellAbove && this.IsFriendly(cellAbove))
            ) {
                this.DrawSquare(ctx, currentWidth, currentHeight);
            }
        }
    }

    private DrawEven(
        ctx: CanvasRenderingContext2D,
        currentWidth: number,
        currentHeight: number,
        row: Array<Cell | undefined>
    ): void {
        let cellAbove: Cell | undefined = row[0];
        let cellBelow: Cell | undefined = row[2];

        if (
            (!cellAbove && cellBelow && this.IsFriendly(cellBelow)) ||
            (!cellBelow && cellAbove && this.IsFriendly(cellAbove))
        ) {
            this.DrawSquare(ctx, currentWidth, currentHeight);
        } else if (cellAbove && this.IsFriendly(cellAbove) && cellBelow && this.IsFriendly(cellBelow)) {
            this.DrawSquare(ctx, currentWidth, currentHeight);
        } else if (cellAbove && this.IsEnemy(cellAbove) && cellBelow && this.IsEnemy(cellBelow)) {
            this.DrawInny(ctx, currentWidth, currentHeight);
        } else if (cellAbove && this.IsFriendly(cellAbove) && cellBelow && this.IsEnemy(cellBelow)) {
            this.DrawRightInnerCurve(ctx, currentWidth, currentHeight);
        } else if (cellAbove && this.IsEnemy(cellAbove) && cellBelow && this.IsFriendly(cellBelow)) {
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

    Export(opt: CanvasRendererExportOptions): any {
        switch (opt) {
            case CanvasRendererExportOptions.DataUrl:
                return this.DataUrl();
                break;
            case CanvasRendererExportOptions.Browser:
                if (IsBrowser()) {
                    let image = this.DataUrl();
                    let link = document.createElement('a');
                    link.download = this.Random.OSeed.toString() + '.png';
                    link.href = image;
                    link.click();
                    return true;
                } else {
                    throw new Error('Not in browser');
                }
                break;
            case CanvasRendererExportOptions.NodeJs:
                if (IsNodejs()) {
                    let dataUrl = this.DataUrl();
                    let data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                    return new Buffer(data, 'base64');
                } else {
                    throw new Error('Not in Nodejs');
                }
                break;
        }
        console.log('No options passed in');
        return false;
    }

    DataUrl() {
        return this.Canvas.toDataURL('image/png');
    }
}
