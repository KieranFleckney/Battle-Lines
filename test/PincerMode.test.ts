import { PincerMode, SeedRand, Grid, CellTypes } from '../src/Index';

describe('PincerMode test', () => {
    it('Contructor', () => {
        expect(() => {
            new PincerMode('');
        }).toThrowError(Error);

        let emptyConfig = {};
        expect(() => {
            new PincerMode(emptyConfig);
        }).toThrowError(Error);

        let battleConfig = { BattleFieldSize: '' };
        expect(() => {
            new PincerMode(battleConfig);
        }).toThrowError(Error);

        battleConfig = { BattleFieldSize: '20' };
        expect(() => {
            new PincerMode(battleConfig);
        }).toThrowError(Error);

        let randomConfig = { BattleFieldSize: 20, Random: '' };
        expect(() => {
            new PincerMode(randomConfig);
        }).toThrowError(Error);

        randomConfig = { BattleFieldSize: 20, Random: [0, 1] as any };
        expect(() => {
            new PincerMode(randomConfig);
        }).toThrowError(Error);

        let attackerSizeConfig = { BattleFieldSize: 20, Random: [0, 1] as any, AttackerSize: 'string' as any };
        expect(() => {
            new PincerMode(attackerSizeConfig);
        }).toThrowError(Error);
    });

    let random = new SeedRand(324363.1680802235);
    let config = { BattleFieldSize: 10, Random: random, AttackerSize: 40 };
    let pincerMode = new PincerMode(config);
    let grid = new Grid(1718, 1287, 20);
    grid = pincerMode.Battle(grid);

    it('Attacker Size', () => {
        expect(pincerMode.AttackerCamp.Start).toEqual(22);
        expect(pincerMode.AttackerCamp.End).toEqual(62);
    });

    it('BattleFields', () => {
        expect(pincerMode.BattleField.length).toEqual(2);
    });

    it('BattleFields sizes', () => {
        expect(pincerMode.BattleField[0].Start).toEqual(17);
        expect(pincerMode.BattleField[0].End).toEqual(27);
        expect(pincerMode.BattleField[1].Start).toEqual(57);
        expect(pincerMode.BattleField[1].End).toEqual(67);
    });

    it('Attackers', () => {
        expect(grid.Cells[0][27].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[0][56].Type).toEqual(CellTypes.Victory);
    });

    it('Defenders', () => {
        expect(grid.Cells[0][0].Type).toEqual(CellTypes.Defeat);
        expect(grid.Cells[0][84].Type).toEqual(CellTypes.Defeat);
    });

    it('Odd', () => {
        expect(grid.Cells[4][17].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[62][62].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[61][60].Type).toEqual(CellTypes.Defeat);
    });

    it('Even', () => {
        expect(grid.Cells[3][22].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[61][61].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[1][18].Type).toEqual(CellTypes.Defeat);
    });

    it('Final', () => {
        // Triplets
        expect(grid.Cells[14][26].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[52][56].Type).toEqual(CellTypes.Victory);

        // Singles
        expect(grid.Cells[8][66].Type).toEqual(CellTypes.Defeat);
        expect(grid.Cells[56][66].Type).toEqual(CellTypes.Defeat);
        expect(grid.Cells[54][16].Type).toEqual(CellTypes.Victory);
    });
});
