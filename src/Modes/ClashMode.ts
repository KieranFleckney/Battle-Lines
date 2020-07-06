import { SeedRand, IsOdd, IsNumeric } from '../Utilities/Utilities';
import { Grid } from '../Grid/Grid';
import { BattleField } from './BattleField';
import { Cell } from '../Grid/Cell';
import { CellTypes } from '../Grid/Cell-Types';
import { IMode } from './IMode';

export class ClashMode implements IMode {
    Random: SeedRand;
    BattleFieldSize: number;
    BattleField: BattleField;
    ColourTwoMaxLenghtPercent: number;
    private ColourTwoMaxLenghtIsPercent: boolean;
    ColourTwoChancePercent: number;
    ColourOneMaxLenghtPercent: number;
    private ColourOneMaxLenghtIsPercent: boolean;
    LastCellSingleChance: number;

    /**
     * ClashMode generates a pattern with vertical strip centre
     * @param config
     */
    constructor(config: any) {
        if (config) {
            if (config.BattleFieldSize) {
                if (IsNumeric(config.BattleFieldSize)) {
                    this.BattleFieldSize = config.BattleFieldSize;
                } else {
                    throw new Error('"BattleFieldSize" from Config is not a number');
                }
            } else {
                throw new Error('Missing "BattleFieldSize" from Config');
            }

            // REVIEW: Change default to 40%??
            this.ColourTwoMaxLenghtPercent = 20;
            this.ColourTwoMaxLenghtIsPercent = true;

            // REVIEW: Calculate the percent here then in BattleEven
            if (config.ColourTwoMaxLenghtPercent) {
                if (
                    config.ColourTwoMaxLenghtPercent.toString().substr(config.ColourTwoMaxLenghtPercent.length - 1) ===
                    '%'
                ) {
                    let percent: number = Number(
                        config.ColourTwoMaxLenghtPercent.toString().substr(
                            0,
                            config.ColourTwoMaxLenghtPercent.length - 1
                        )
                    );
                    if (percent >= 0 && percent <= 100) {
                        this.ColourTwoMaxLenghtPercent = percent;
                        this.ColourTwoMaxLenghtIsPercent = true;
                    } else {
                        throw new Error('"ColourTwoMaxLenghtPercent" must be a number between 0-100');
                    }
                } else {
                    if (
                        config.ColourTwoMaxLenghtPercent >= 0 &&
                        config.ColourTwoMaxLenghtPercent <= this.BattleFieldSize
                    ) {
                        this.ColourTwoMaxLenghtPercent = config.ColourTwoMaxLenghtPercent;
                        this.ColourTwoMaxLenghtIsPercent = false;
                    } else {
                        throw new Error(
                            '"ColourTwoMaxLenghtPercent" must be a number between 0 - <BattleFieldSize> or a percent (add %)'
                        );
                    }
                }
            }

            this.ColourTwoChancePercent = 0.75;

            if (config.ColourTwoChancePercent) {
                if (config.ColourTwoChancePercent >= 0 && config.ColourTwoChancePercent <= 100) {
                    this.ColourTwoChancePercent = config.ColourTwoChancePercent / 100;
                } else {
                    throw new Error('"ColourTwoChancePercent" must be a number between 0-100');
                }
            }

            this.ColourOneMaxLenghtPercent = this.BattleFieldSize;
            this.ColourOneMaxLenghtIsPercent = false;

            if (config.ColourOneMaxLenghtPercent) {
                if (
                    config.ColourOneMaxLenghtPercent.toString().substr(config.ColourOneMaxLenghtPercent.length - 1) ===
                    '%'
                ) {
                    let percent: number = Number(
                        config.ColourOneMaxLenghtPercent.toString().substr(
                            0,
                            config.ColourOneMaxLenghtPercent.length - 1
                        )
                    );
                    if (percent >= 0 && percent <= 100) {
                        this.ColourOneMaxLenghtPercent = percent;
                        this.ColourOneMaxLenghtIsPercent = true;
                    } else {
                        throw new Error('"ColourOneMaxLenghtPercent" must be a number between 0-100');
                    }
                } else {
                    if (
                        config.ColourOneMaxLenghtPercent >= 0 &&
                        config.ColourOneMaxLenghtPercent <= this.BattleFieldSize
                    ) {
                        this.ColourOneMaxLenghtPercent = config.ColourOneMaxLenghtPercent;
                        this.ColourOneMaxLenghtIsPercent = false;
                    } else {
                        throw new Error(
                            '"ColourOneMaxLenghtPercent" must be a number between 0 - <BattleFieldSize> or a percent (add %)'
                        );
                    }
                }
            }

            this.LastCellSingleChance = 0.5;

            if (config.LastCellSingleChance) {
                if (config.LastCellSingleChance >= 0 && config.LastCellSingleChance <= 100) {
                    this.LastCellSingleChance = config.LastCellSingleChance / 100;
                } else {
                    throw new Error('"LastCellSingleChance" must be a number between 0-100');
                }
            }

            if (config.Random instanceof SeedRand) {
                this.Random = config.Random;
            } else {
                throw new Error('Missing Seeded Random Generator (Internal Error)');
            }
            this.BattleField = new BattleField(0, 0);
        } else {
            throw new Error('Missing config');
        }
    }

    /**
     * Generate next pattern for next seed
     * @param grid
     */
    Battle(grid: Grid): Grid {
        this.CalculateBattleField(grid.Columns);
        grid = this.GenerateAttackers(grid);
        grid = this.GenerateDefenders(grid);
        grid = this.BattleOdd(grid);
        grid = this.BattleEven(grid);
        grid = this.FinalStand(grid);
        return grid;
    }

    /**
     * Calculates battlefield size
     * @param columns number of columns in grid
     */
    private CalculateBattleField(columns: number): void {
        let battleGroundSize: number = 0;

        if (IsOdd(this.BattleFieldSize)) {
            battleGroundSize = this.BattleFieldSize - 1;
        } else {
            battleGroundSize = this.BattleFieldSize;
        }

        let middle = Math.floor(columns / 2);
        let battleFieldStart = middle - Math.floor(battleGroundSize / 2);
        let battleFieldEnd = middle + Math.floor(battleGroundSize / 2);

        this.BattleField = new BattleField(battleFieldStart, battleFieldEnd);
    }

    /**
     * Places colour one on grid
     * @param grid
     */
    private GenerateAttackers(grid: Grid): Grid {
        for (const row of grid.Cells) {
            for (const cell of row) {
                if (cell.X < this.BattleField.Start) {
                    cell.Type = CellTypes.Victory;
                }
            }
        }

        return grid;
    }

    /**
     * Places colour two on grid
     * @param grid
     */
    private GenerateDefenders(grid: Grid): Grid {
        for (const row of grid.Cells) {
            for (const cell of row) {
                if (cell.X > this.BattleField.End) {
                    cell.Type = CellTypes.Defeat;
                }
            }
        }

        return grid;
    }

    /**
     * Calculates lines for all odd rows in grid for colour one
     * @param grid
     */
    private BattleOdd(grid: Grid): Grid {
        let maxLenght: number = 0;
        if (this.ColourOneMaxLenghtIsPercent) {
            maxLenght = Math.ceil((this.BattleFieldSize / 100) * this.ColourOneMaxLenghtPercent);
        } else {
            maxLenght = Math.ceil(this.ColourOneMaxLenghtPercent);
        }

        for (const row of grid.Cells) {
            if (!IsOdd(row[0].Y)) continue;
            let cells: Array<Cell> = row.filter((cell) => this.IsInBattle(cell.X));
            let battleLenghtLeft: number = this.BattleField.CalculateLenght();
            let currentBattleLenght: number = 0;
            let attack: boolean = false;

            for (const cell of cells) {
                if (currentBattleLenght === 0) {
                    attack = !attack;
                    this.Random.Max = maxLenght < battleLenghtLeft ? maxLenght : battleLenghtLeft;
                    currentBattleLenght = Math.round(this.Random.Next());
                    battleLenghtLeft -= currentBattleLenght;

                    if (currentBattleLenght === 0) {
                        battleLenghtLeft -= 1;
                        cell.Type = CellTypes.Defeat;
                    } else {
                        currentBattleLenght -= 1;
                        attack ? (cell.Type = CellTypes.Victory) : (cell.Type = CellTypes.Defeat);
                    }
                } else {
                    currentBattleLenght -= 1;
                    attack ? (cell.Type = CellTypes.Victory) : (cell.Type = CellTypes.Defeat);
                }
            }
        }

        return grid;
    }

    /**
     * Calculates lines for all even rows in grid for colour one
     * @param grid
     */
    private BattleEven(grid: Grid): Grid {
        let maxLenght: number = 0;
        if (this.ColourTwoMaxLenghtIsPercent) {
            maxLenght = Math.ceil((this.BattleFieldSize / 100) * this.ColourTwoMaxLenghtPercent);
        } else {
            maxLenght = Math.ceil(this.ColourTwoMaxLenghtPercent);
        }

        for (const row of grid.Cells) {
            if (IsOdd(row[0].Y)) continue;
            let cells: Array<Cell> = row.filter((cell) => this.IsInBattle(cell.X));
            let aboveRow: Array<Cell> | undefined = grid.Cells.find((c) => c[0].Y === row[0].Y + 1);
            let bewlowRow: Array<Cell> | undefined = grid.Cells.find((c) => c[0].Y === row[0].Y - 1);
            let pointCount: number = 0;

            if (!aboveRow && !bewlowRow) {
                continue;
            }

            for (const cell of cells) {
                let cellsToCheck: Array<Cell | undefined> = new Array<Cell>();
                let skip: boolean = false;

                cellsToCheck.push(aboveRow?.[cell.X - 1]);
                cellsToCheck.push(aboveRow?.[cell.X]);
                cellsToCheck.push(aboveRow?.[cell.X - 2]);
                cellsToCheck.push(bewlowRow?.[cell.X - 1]);
                cellsToCheck.push(bewlowRow?.[cell.X]);
                cellsToCheck.push(bewlowRow?.[cell.X - 2]);

                for (const cellCheck of cellsToCheck) {
                    if (cellCheck?.Type !== CellTypes.Victory) {
                        skip = true;
                        break;
                    }
                }

                if (skip) {
                    cell.Type = CellTypes.Defeat;
                    continue;
                }

                if (pointCount >= maxLenght) {
                    pointCount = 0;
                    cell.Type = CellTypes.Defeat;
                    continue;
                } else {
                    this.Random.Max = 1;
                    let battleOutcome: number = this.Random.Next();
                    if (battleOutcome < this.ColourTwoChancePercent) {
                        cell.Type = CellTypes.Victory;
                        pointCount += 1;
                    } else {
                        cell.Type = CellTypes.Defeat;
                        pointCount = 0;
                    }
                }
            }
        }

        return grid;
    }

    /**
     * Final pass over all rows to fix some anomalies with line generates
     * @param grid
     */
    private FinalStand(grid: Grid): Grid {
        for (const row of grid.Cells) {
            if (!IsOdd(row[0].Y)) continue;

            // This checks to see if three consecutive rows (start of battlefield) are the same lengh then changes the odd row by one
            if (row[this.BattleField.Start - 1].Type === CellTypes.Defeat) {
                let aboveRow: Array<Cell> | undefined = grid.Cells[row[0].Y];
                let bewlowRow: Array<Cell> | undefined = grid.Cells[row[0].Y - 2];

                if (aboveRow && bewlowRow) {
                    if (
                        aboveRow[this.BattleField.Start - 1].Type === CellTypes.Defeat &&
                        bewlowRow[this.BattleField.Start - 1].Type === CellTypes.Defeat
                    ) {
                        row[this.BattleField.Start - 1].Type = CellTypes.Victory;
                    }
                }
            }

            // Chance to remove alone cells at the end of the battlefield
            if (
                row[this.BattleField.End - 1].Type === CellTypes.Victory &&
                row[this.BattleField.End - 2].Type === CellTypes.Defeat
            ) {
                this.Random.Max = 1;
                if (this.Random.Next() < this.LastCellSingleChance) {
                    row[this.BattleField.End - 1].Type = CellTypes.Defeat;
                }
            }
        }

        return grid;
    }

    /**
     * Checks if current cell is in battlefield zone
     * @param x X value of current cell
     */
    private IsInBattle(x: number): boolean {
        let inBattle: boolean = false;

        if (x >= this.BattleField.Start && x <= this.BattleField.End) {
            inBattle = true;
        }

        return inBattle;
    }
}
