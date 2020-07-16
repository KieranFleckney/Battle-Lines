import { ScatterMode, SeedRand, Grid, CellTypes } from '../src/Index';

describe('ScatterMode test', () => {
    it('Contructor', () => {
        expect(() => {
            new ScatterMode('');
        }).toThrowError(Error);

        let emptyConfig = {};
        expect(() => {
            new ScatterMode(emptyConfig);
        }).toThrowError(Error);

        let battleConfig = { BattleFieldSize: '' };
        expect(() => {
            new ScatterMode(battleConfig);
        }).toThrowError(Error);

        battleConfig = { BattleFieldSize: '20' };
        expect(() => {
            new ScatterMode(battleConfig);
        }).toThrowError(Error);

        let randomConfig = { BattleFieldSize: 20, Random: '' };
        expect(() => {
            new ScatterMode(randomConfig);
        }).toThrowError(Error);

        randomConfig = { BattleFieldSize: 20, Random: [0, 1] as any };
        expect(() => {
            new ScatterMode(randomConfig);
        }).toThrowError(Error);
    });

    let random = new SeedRand(324363.1680802235);
    let config = { BattleFieldSize: 20, Random: random };
    let clashMode = new ScatterMode(config);
    let grid = new Grid(1718, 1287, 20);
    grid = clashMode.Battle(grid);

    it('BattleField start/end', () => {
        expect(clashMode.BattleField.Start).toEqual(32);
        expect(clashMode.BattleField.End).toEqual(52);
    });

    it('No Attackers Side', () => {
        expect(grid.Cells[0][0].Type).toEqual(CellTypes.Defeat);
    });

    it('Defenders', () => {
        expect(grid.Cells[0][84].Type).toEqual(CellTypes.Defeat);
    });

    it('Odd', () => {
        expect(grid.Cells[0][32].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[6][32].Type).toEqual(CellTypes.Defeat);
        expect(grid.Cells[12][32].Type).toEqual(CellTypes.Victory);
    });

    it('Even', () => {
        expect(grid.Cells[59][33].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[13][35].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[59][34].Type).toEqual(CellTypes.Defeat);
    });

    it('Final', () => {
        expect(grid.Cells[18][31].Type).toEqual(CellTypes.Defeat);
        expect(grid.Cells[50][31].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[48][51].Type).toEqual(CellTypes.Victory);
    });
});
