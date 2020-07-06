import { ClashMode, SeedRand, Grid, CellTypes } from '../src/Index';

describe('ClashMode test', () => {
    it('Contructor', () => {
        expect(() => {
            new ClashMode('');
        }).toThrowError(Error);

        let emptyConfig = {};
        expect(() => {
            new ClashMode(emptyConfig);
        }).toThrowError(Error);

        let battleConfig = { BattleFieldSize: '' };
        expect(() => {
            new ClashMode(battleConfig);
        }).toThrowError(Error);

        let randomConfig = { BattleFieldSize: '20', Random: '' };
        expect(() => {
            new ClashMode(randomConfig);
        }).toThrowError(Error);
    });

    let random = new SeedRand(324363.1680802235);
    let config = { BattleFieldSize: '20', Random: random };
    let clashMode = new ClashMode(config);
    let grid = new Grid(1718, 1287, 20);
    grid = clashMode.Battle(grid);

    it('BattleField start/end', () => {
        expect(clashMode.BattleField.Start).toEqual(32);
        expect(clashMode.BattleField.End).toEqual(52);
    });

    it('Attackers', () => {
        expect(grid.Cells[0][0].Type).toEqual(CellTypes.Victory);
    });

    it('Defenders', () => {
        expect(grid.Cells[0][84].Type).toEqual(CellTypes.Defeat);
    });

    it('Odd', () => {
        expect(grid.Cells[6][33].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[6][34].Type).toEqual(CellTypes.Defeat);
    });

    it('Even', () => {
        expect(grid.Cells[59][33].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[59][32].Type).toEqual(CellTypes.Defeat);
        expect(grid.Cells[59][34].Type).toEqual(CellTypes.Defeat);
    });

    it('Final', () => {
        expect(grid.Cells[14][31].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[48][31].Type).toEqual(CellTypes.Victory);
        expect(grid.Cells[18][51].Type).toEqual(CellTypes.Defeat);
        expect(grid.Cells[50][51].Type).toEqual(CellTypes.Defeat);
    });
});
