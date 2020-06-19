import { SeedRand, IsOdd } from '../Utilities';
import { Grid } from '../Grid/Grid';
import { BattleField } from './BattleField';
import { Cell } from '../Grid/Cell';
import { CellTypes } from '../Grid/Cell-Types';
import { IMode } from './IMode';

export class ClashMode implements IMode {
    Random: SeedRand;
    BattleFieldSize: number;
    BattleField: BattleField;
    // TODO: Rename to colour not even
    EvenMaxLenghtPercent: number;
    EvenChancePercent: number;
    // TODO: add paramters to colour one not just colour 2

    constructor(config: any) {
        if (config) {
            if (config.BattleFieldSize) {
                this.BattleFieldSize = config.BattleFieldSize;
            } else {
                throw new Error('Missing "BattleFieldSize" from Config');
            }

            this.EvenMaxLenghtPercent = 20;

            if (config.EvenMaxLenghtPercent) {
                if (config.EvenMaxLenghtPercent >= 0 && config.EvenMaxLenghtPercent <= 100) {
                    this.EvenMaxLenghtPercent = config.EvenMaxLenghtPercent;
                } else {
                    throw new Error('"EvenMaxLenghtPercent" must be a number between 0-100');
                }
            }

            this.EvenChancePercent = 0.75;

            if (config.EvenChancePercent) {
                if (config.EvenChancePercent >= 0 && config.EvenChancePercent <= 100) {
                    this.EvenChancePercent = config.EvenChancePercent / 100;
                } else {
                    throw new Error('"EvenChancePercent" must be a number between 0-100');
                }
            }

            this.Random = config.Random;
            this.BattleField = new BattleField(0, 0);
        } else {
            throw new Error('Missing config');
        }
    }

    Battle(grid: Grid): Grid {
        this.CalculateBattleField(grid.Columns);
        grid = this.GenerateAttackers(grid);
        grid = this.GenerateDefenders(grid);
        grid = this.BattleOdd(grid);
        grid = this.BattleEven(grid);
        grid = this.FinalStand(grid);
        return grid;
    }

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

    private BattleOdd(grid: Grid): Grid {
        for (const row of grid.Cells) {
            if (!IsOdd(row[0].Y)) continue;
            let cells: Array<Cell> = row.filter((cell) => this.IsInBattle(cell.X));
            let battleLenghtLeft: number = this.BattleField.CalculateLenght();
            let currentBattleLenght: number = 0;
            let attack: boolean = false;

            for (const cell of cells) {
                if (currentBattleLenght === 0) {
                    attack = !attack;
                    this.Random.Max = battleLenghtLeft;
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

    private BattleEven(grid: Grid): Grid {
        let maxLenght: number = Math.ceil((this.BattleFieldSize / 100) * this.EvenMaxLenghtPercent);
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

                // Get list of a few points which must be there for the visuals to work
                cellsToCheck.push(aboveRow?.[cell.X - 1]);
                cellsToCheck.push(aboveRow?.[cell.X]);
                cellsToCheck.push(aboveRow?.[cell.X - 2]);
                cellsToCheck.push(bewlowRow?.[cell.X - 1]);
                cellsToCheck.push(bewlowRow?.[cell.X]);
                cellsToCheck.push(bewlowRow?.[cell.X - 2]);

                // check if the list if points are of the correct type
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
                    if (battleOutcome < this.EvenChancePercent) {
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

    private FinalStand(grid: Grid): Grid {
        for (const row of grid.Cells) {
            if (!IsOdd(row[0].Y)) continue;
            if (row[this.BattleField.Start - 1].Type === CellTypes.Defeat) {
                let aboveRow: Array<Cell> | undefined = grid.Cells[row[0].Y];
                let bewlowRow: Array<Cell> | undefined = grid.Cells[row[0].Y - 2];

                if (!aboveRow && !bewlowRow) {
                    continue;
                }

                if (
                    aboveRow[this.BattleField.Start - 1].Type === CellTypes.Defeat &&
                    bewlowRow[this.BattleField.Start - 1].Type === CellTypes.Defeat
                ) {
                    row[this.BattleField.Start - 1].Type = CellTypes.Victory;
                }
            }
        }

        return grid;
    }

    private IsInBattle(x: number): boolean {
        let inBattle: boolean = false;

        if (x >= this.BattleField.Start && x <= this.BattleField.End) {
            inBattle = true;
        }

        return inBattle;
    }
}

// TODO: End of battlefield someones times odd seems to have a lot of single/dots which is vert obvoiues
