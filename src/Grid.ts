import { GridConfig } from './Grid-Config';
import { Point } from './Point';
import { PointTypes } from './Point-Types';
import { IsOdd, SeedRand, Rand } from './Utilities';
import { BattleField } from './BattleField';
import { IRenderer } from './IRenderer';
import { TextRenderer } from './TextRenderer';

export class Grid {
    Rows: number;
    Columns: number;
    PointSize: number;
    Height: number;
    Width: number;
    Points: Array<Array<Point>>;
    BattleFieldSize: number;
    BattleFields: Array<BattleField>;
    Renderer: IRenderer;
    Seed: number;

    constructor(parms: GridConfig, renderer?: IRenderer) {
        if (parms) {
            this.Height = parms.Height;
            this.Width = parms.Width;
            this.PointSize = parms.PointSize;
            this.BattleFieldSize = parms.BattleGroundSize;
        } else {
            throw new Error('Missing Paramters');
        }

        this.Rows = this.CalculateRow(this.Height, this.PointSize);
        this.Columns = this.CalculateColumns(this.Width, this.PointSize);
        this.Points = new Array<Array<Point>>();
        this.BattleFields = new Array<BattleField>();

        this.BattleFields.push(this.CalculateBattleField());
        this.GenertatePoints();
        this.GenerateAttackers();
        this.GenerateBattleField();
        this.BattleOdd();
        this.BattleEven();

        if (renderer) {
            this.Renderer = renderer;
        } else {
            this.Renderer = new TextRenderer();
        }
        this.Renderer.SetGridParameters(
            this.Rows,
            this.Columns,
            this.Height,
            this.Width,
            this.PointSize,
            this.BattleFieldSize
        );

        this.Seed = Rand();
    }

    private CalculateRow(height: number, pointSize: number): number {
        return Math.floor(height / pointSize);
    }

    private CalculateColumns(width: number, pointSize: number): number {
        return Math.floor(width / pointSize);
    }

    // REVIEW: Maybe Look at merging GenertatePoints,GenerateSolid,GenerateBattleField into one function/loop
    private GenertatePoints(): void {
        for (let y = 1; y <= this.Rows; y++) {
            this.Points.push(new Array<Point>());
            for (let x = 1; x <= this.Columns; x++) {
                this.Points[y - 1][x - 1] = new Point(x, y);
            }
        }
    }

    private GenerateAttackers(): void {
        let middle = Math.floor(this.Columns / 2);

        for (const row of this.Points) {
            for (const point of row) {
                if (point.X <= middle) {
                    point.Type = PointTypes.Attacker;
                }
            }
        }
    }

    private GenerateBattleField(): void {
        for (const row of this.Points) {
            for (const point of row) {
                if (this.IsInBattle(point.X)) {
                    point.Type = PointTypes.BattleGround;
                }
            }
        }
    }

    private CalculateBattleField(): BattleField {
        let battleGroundSize: number = 0;

        if (IsOdd(this.BattleFieldSize)) {
            battleGroundSize = this.BattleFieldSize - 1;
        } else {
            battleGroundSize = this.BattleFieldSize;
        }

        let middle = Math.floor(this.Columns / 2);
        let battleFieldStart = middle - Math.floor(battleGroundSize / 2);
        let battleFieldEnd = middle + Math.floor(battleGroundSize / 2);

        return new BattleField(battleFieldStart, battleFieldEnd);
    }

    private IsInBattle(x: number, battleField?: BattleField): boolean {
        let battleFields: Array<BattleField> = this.BattleFields;
        let inBattle: boolean = false;

        if (battleField) {
            battleFields = new Array<BattleField>();
            battleFields.push(battleField);
        }

        for (const currntBattleField of battleFields) {
            if (x >= currntBattleField.Start && x <= currntBattleField.End) {
                inBattle = true;
                break;
            }
        }

        return inBattle;
    }

    private BattleOdd(): void {
        let rand = new SeedRand(this.Seed);
        for (const battleField of this.BattleFields) {
            for (const row of this.Points) {
                if (!IsOdd(row[0].Y)) continue;
                let points: Array<Point> = row.filter((point) => this.IsInBattle(point.X, battleField));
                let battleLenghtLeft: number = battleField.CalculateLenght();
                let currentBattleLenght: number = 0;
                let attack: boolean = false;

                for (const point of points) {
                    if (currentBattleLenght === 0) {
                        attack = !attack;
                        rand.Max = battleLenghtLeft;
                        currentBattleLenght = Math.round(rand.Next());
                        battleLenghtLeft -= currentBattleLenght;

                        if (currentBattleLenght === 0) {
                            battleLenghtLeft -= 1;
                            point.Type = PointTypes.Defeat;
                        } else {
                            currentBattleLenght -= 1;
                            attack ? (point.Type = PointTypes.Victory) : (point.Type = PointTypes.Defeat);
                        }
                    } else {
                        currentBattleLenght -= 1;
                        attack ? (point.Type = PointTypes.Victory) : (point.Type = PointTypes.Defeat);
                    }
                }
            }
        }
    }

    // REVIEW: Maybe I should check for whole possile lenght then rand once, unsure sounds more complicated.
    private BattleEven(): void {
        let rand = new SeedRand(this.Seed);
        let maxLenght: number = Math.ceil(this.BattleFieldSize / 5);
        for (const battleField of this.BattleFields) {
            for (const row of this.Points) {
                if (IsOdd(row[0].Y)) continue;
                let points: Array<Point> = row.filter((point) => this.IsInBattle(point.X, battleField));
                let aboveRow: Array<Point> | undefined = this.Points.find((p) => p[0].Y === row[0].Y + 1);
                let bewlowRow: Array<Point> | undefined = this.Points.find((p) => p[0].Y === row[0].Y - 1);
                let pointCount: number = 0;

                if (!aboveRow && !bewlowRow) {
                    continue;
                }

                for (const point of points) {
                    let pointsToCheck: Array<Point | undefined> = new Array<Point>();
                    let skip: boolean = false;

                    // Get list of a few points which must be there for the visuals to work
                    pointsToCheck.push(aboveRow?.[point.X - 1]);
                    pointsToCheck.push(aboveRow?.[point.X]);
                    pointsToCheck.push(aboveRow?.[point.X - 2]);
                    pointsToCheck.push(bewlowRow?.[point.X - 1]);
                    pointsToCheck.push(bewlowRow?.[point.X]);
                    pointsToCheck.push(bewlowRow?.[point.X - 2]);

                    // check if the list if points are of the correct type
                    for (const pointCheck of pointsToCheck) {
                        if (pointCheck?.Type !== PointTypes.Attacker && pointCheck?.Type !== PointTypes.Victory) {
                            skip = true;
                            break;
                        }
                    }

                    if (skip) {
                        point.Type = PointTypes.Defeat;
                        continue;
                    }

                    if (pointCount >= maxLenght) {
                        pointCount = 0;
                        point.Type = PointTypes.Defeat;
                        continue;
                    } else {
                        let battleOutcome: number = rand.Next();
                        if (battleOutcome < 0.75) {
                            point.Type = PointTypes.Victory;
                            pointCount += 1;
                        } else {
                            point.Type = PointTypes.Defeat;
                            pointCount = 0;
                        }
                    }
                }
            }
        }
    }
}
