import { SeedRand, IsOdd, IsNumeric } from '../Utilities/Utilities';
import { Grid } from '../Grid/Grid';
import { BattleField } from './BattleField';
import { Cell } from '../Grid/Cell';
import { CellTypes } from '../Grid/Cell-Types';
import { IMode } from './IMode';

export class ClashModeVertical implements IMode {
    Random: SeedRand;
    BattleFieldSize: number;
    BattleField: BattleField;
    ColourTwoMaxLenghtPercent: number;
    ColourTwoChancePercent: number;
    ColourOneMaxLenghtPercent: number;
    LastCellSingleChance: number;

    /**
     * ClashMode generates a pattern with vertical strip centre
     * @param config
     */
    constructor(config: any) {
        if (config) {
            if (config.BattleFieldSize) {
                // FIX: Validate battlefield size isn't bigger then grid rows
                if (IsNumeric(config.BattleFieldSize)) {
                    this.BattleFieldSize = config.BattleFieldSize;
                } else {
                    throw new Error('"BattleFieldSize" from Config is not a number');
                }
            } else {
                throw new Error('Missing "BattleFieldSize" from Config');
            }

            // REVIEW: Change default to 40%??
            this.ColourTwoMaxLenghtPercent = Math.ceil((this.BattleFieldSize / 100) * 20);

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
                        this.ColourTwoMaxLenghtPercent = Math.ceil((this.BattleFieldSize / 100) * percent);
                    } else {
                        throw new Error('"ColourTwoMaxLenghtPercent" must be a number between 0-100');
                    }
                } else {
                    if (
                        config.ColourTwoMaxLenghtPercent >= 0 &&
                        config.ColourTwoMaxLenghtPercent <= this.BattleFieldSize
                    ) {
                        this.ColourTwoMaxLenghtPercent = Math.ceil(config.ColourTwoMaxLenghtPercent);
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
                        this.ColourOneMaxLenghtPercent = Math.ceil((this.BattleFieldSize / 100) * percent);
                    } else {
                        throw new Error('"ColourOneMaxLenghtPercent" must be a number between 0-100');
                    }
                } else {
                    if (
                        config.ColourOneMaxLenghtPercent >= 0 &&
                        config.ColourOneMaxLenghtPercent <= this.BattleFieldSize
                    ) {
                        this.ColourOneMaxLenghtPercent = Math.ceil(config.ColourOneMaxLenghtPercent);
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
        this.CalculateBattleField(grid.Rows);
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
    private CalculateBattleField(rows: number): void {
        let battleGroundSize: number = 0;

        if (IsOdd(this.BattleFieldSize)) {
            battleGroundSize = this.BattleFieldSize - 1;
        } else {
            battleGroundSize = this.BattleFieldSize;
        }

        let middle = Math.floor(rows / 2);
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
                if (cell.Y < this.BattleField.Start) {
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
                if (cell.Y > this.BattleField.End) {
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
        let maxLenght: number = this.ColourOneMaxLenghtPercent || 0;

        for (let c = 0; c < grid.Columns; c++) {
            if (!IsOdd(grid.Cells[0][c].X)) continue;

            let cells: Array<Cell> = new Array<Cell>();

            for (let r = 0; r < grid.Rows; r++) {
                if (this.IsInBattle(grid.Cells[r][c].Y)) {
                    cells.push(grid.Cells[r][c]);
                }
            }

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
        let maxLenght: number = this.ColourTwoMaxLenghtPercent || 0;

        for (let c = 0; c < grid.Columns; c++) {
            if (IsOdd(grid.Cells[0][c].X)) continue;

            let cells: Array<Cell> = new Array<Cell>();
            let leftRow: Array<Cell> = new Array<Cell>();
            let rightRow: Array<Cell> = new Array<Cell>();
            let pointCount: number = 0;

            for (let r = 0; r < grid.Rows; r++) {
                if (this.IsInBattle(grid.Cells[r][c].Y)) {
                    cells.push(grid.Cells[r][c]);

                    if (grid.Cells[r][c - 1]) {
                        leftRow.push(grid.Cells[r][c - 1]);
                    }

                    if (grid.Cells[r][c + 1]) {
                        rightRow.push(grid.Cells[r][c + 1]);
                    }
                }
            }

            if (!leftRow.length && !rightRow.length) {
                continue;
            }

            for (const cell of cells) {
                let cellsToCheck: Array<Cell | undefined> = new Array<Cell>();
                let skip: boolean = false;

                cellsToCheck.push(leftRow[cell.Y - 1]);
                cellsToCheck.push(leftRow[cell.Y]);
                cellsToCheck.push(leftRow[cell.Y - 2]);
                cellsToCheck.push(rightRow[cell.Y - 1]);
                cellsToCheck.push(rightRow[cell.Y]);
                cellsToCheck.push(rightRow[cell.Y - 2]);

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
        for (let c = 0; c < grid.Columns; c++) {
            if (!IsOdd(grid.Cells[0][c].X)) continue;

            // This checks to see if three consecutive rows (start of battlefield) are the same lengh then changes the odd row by one
            if (grid.Cells[this.BattleField.Start - 1][c].Type === CellTypes.Defeat) {
                let leftRow: Cell = grid.Cells[this.BattleField.Start - 1][c - 1];
                let rightRow: Cell = grid.Cells[this.BattleField.Start - 1][c + 1];

                if (leftRow && rightRow) {
                    if (leftRow.Type === CellTypes.Defeat && rightRow.Type === CellTypes.Defeat) {
                        grid.Cells[this.BattleField.Start - 1][c].Type = CellTypes.Victory;
                    }
                }
            }

            // Chance to remove alone cells at the end of the battlefield
            if (
                grid.Cells[this.BattleField.End - 1][c].Type === CellTypes.Victory &&
                grid.Cells[this.BattleField.End - 2][c].Type === CellTypes.Defeat
            ) {
                this.Random.Max = 1;
                if (this.Random.Next() < this.LastCellSingleChance) {
                    grid.Cells[this.BattleField.End - 1][c].Type = CellTypes.Defeat;
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
