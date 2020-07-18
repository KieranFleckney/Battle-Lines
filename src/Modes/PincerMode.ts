import { SeedRand, IsOdd, IsNumeric } from '../Utilities/Utilities';
import { Grid } from '../Grid/Grid';
import { BattleField } from './BattleField';
import { Cell } from '../Grid/Cell';
import { CellTypes } from '../Grid/Cell-Types';
import { IMode } from './IMode';

export class PincerMode implements IMode {
    Random: SeedRand;
    BattleFieldSize: number;
    BattleField: Array<BattleField>;
    ColourTwoMaxLenghtPercent: number;
    ColourTwoChancePercent: number;
    ColourOneMaxLenghtPercent: number;
    LastCellSingleChance: number;
    AttackerSize: number;
    AttackerCamp: BattleField;

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

            if (config.AttackerSize) {
                if (IsNumeric(config.AttackerSize)) {
                    this.AttackerSize = config.AttackerSize;
                } else {
                    throw new Error('"AttackerSize" from Config is not a number');
                }
            } else {
                throw new Error('Missing "AttackerSize" from Config');
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
            this.BattleField = new Array<BattleField>();
            this.AttackerCamp = new BattleField(0, 0);
        } else {
            throw new Error('Missing config');
        }
    }

    /**
     * Generate next pattern for next seed
     * @param grid
     */
    Battle(grid: Grid): Grid {
        this.AttackerCamp = this.CalculateBattleField(grid.Columns / 2, this.AttackerSize);
        this.BattleField.push(this.CalculateBattleField(this.AttackerCamp.Start, this.BattleFieldSize));
        this.BattleField.push(this.CalculateBattleField(this.AttackerCamp.End, this.BattleFieldSize));
        grid = this.GenerateAttackers(grid);
        grid = this.GenerateDefenders(grid);
        grid = this.BattleOdd(grid);
        grid = this.BattleEven(grid);
        grid = this.FinalStand(grid);
        return grid;
    }

    /**
     *  Calculate a battlefield size
     * @param start The middle of the battle field
     * @param size The size of the battlefield
     */
    private CalculateBattleField(start: number, size: number): BattleField {
        let battleGroundSize: number = 0;
        start = Math.floor(start);

        if (IsOdd(size)) {
            battleGroundSize = size - 1;
        } else {
            battleGroundSize = size;
        }

        let battleFieldStart = start - Math.floor(battleGroundSize / 2);
        let battleFieldEnd = start + Math.floor(battleGroundSize / 2);

        return new BattleField(battleFieldStart, battleFieldEnd);
    }

    /**
     * Places colour one on grid
     * @param grid
     */
    private GenerateAttackers(grid: Grid): Grid {
        for (const row of grid.Cells) {
            for (const cell of row) {
                if (cell.X > this.AttackerCamp.Start && cell.X < this.AttackerCamp.End) {
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
                if (cell.X < this.AttackerCamp.Start || cell.X > this.AttackerCamp.End) {
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

        let battleFieldCount: number = 0;
        for (const battleField of this.BattleField) {
            battleFieldCount++;
            for (const row of grid.Cells) {
                if (!IsOdd(row[0].Y)) continue;
                let cells: Array<Cell> = row.filter((cell) => this.IsInBattle(cell.X, battleField));
                let battleLenghtLeft: number = battleField.CalculateLenght();
                let currentBattleLenght: number = 0;
                let attack: boolean = false;

                if (battleFieldCount === 1) cells.reverse();

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
        }

        return grid;
    }

    /**
     * Calculates lines for all even rows in grid for colour one
     * @param grid
     */
    private BattleEven(grid: Grid): Grid {
        let maxLenght: number = this.ColourTwoMaxLenghtPercent || 0;

        let battleFieldCount: number = 0;
        for (const battleField of this.BattleField) {
            battleFieldCount++;
            for (const row of grid.Cells) {
                if (IsOdd(row[0].Y)) continue;
                let cells: Array<Cell> = row.filter((cell) => this.IsInBattle(cell.X, battleField));
                let aboveRow: Array<Cell> | undefined = grid.Cells.find((c) => c[0].Y === row[0].Y + 1);
                let bewlowRow: Array<Cell> | undefined = grid.Cells.find((c) => c[0].Y === row[0].Y - 1);
                let pointCount: number = 0;

                if (!aboveRow && !bewlowRow) {
                    continue;
                }

                if (battleFieldCount === 1) cells.reverse();

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
            let battleFieldCount: number = 0;
            for (const battleField of this.BattleField) {
                battleFieldCount++;
                let tripletsIndexToCheck: number = -1;
                let singleIndexToCheck: number = -1;
                let singleIndexFriendToCheck: number = -1;

                if (battleFieldCount === 1) {
                    tripletsIndexToCheck = battleField.End - 1;
                    singleIndexToCheck = battleField.Start - 1;
                    singleIndexFriendToCheck = battleField.Start;
                } else if (battleFieldCount === 2) {
                    tripletsIndexToCheck = battleField.Start - 1;
                    singleIndexToCheck = battleField.End - 1;
                    singleIndexFriendToCheck = battleField.End;
                }

                if (tripletsIndexToCheck !== -1) {
                    if (row[tripletsIndexToCheck].Type === CellTypes.Defeat) {
                        let aboveRow: Array<Cell> | undefined = grid.Cells[row[0].Y];
                        let bewlowRow: Array<Cell> | undefined = grid.Cells[row[0].Y - 2];

                        if (aboveRow && bewlowRow) {
                            if (
                                aboveRow[tripletsIndexToCheck].Type === CellTypes.Defeat &&
                                bewlowRow[tripletsIndexToCheck].Type === CellTypes.Defeat
                            ) {
                                row[tripletsIndexToCheck].Type = CellTypes.Victory;
                            }
                        }
                    }
                }

                if (singleIndexToCheck !== -1 && singleIndexFriendToCheck !== -1) {
                    // Chance to remove alone cells at the end of the battlefield
                    if (
                        row[singleIndexToCheck].Type === CellTypes.Victory &&
                        row[singleIndexFriendToCheck].Type === CellTypes.Defeat
                    ) {
                        this.Random.Max = 1;
                        if (this.Random.Next() < this.LastCellSingleChance) {
                            row[singleIndexToCheck].Type = CellTypes.Defeat;
                        }
                    }
                }
            }
        }

        return grid;
    }

    /**
     * Checks if current cell is in battlefield zone
     * @param x X value of current cell
     */
    private IsInBattle(x: number, battleField: BattleField): boolean {
        let inBattle: boolean = false;

        if (x >= battleField.Start && x <= battleField.End) {
            inBattle = true;
        }

        return inBattle;
    }
}
