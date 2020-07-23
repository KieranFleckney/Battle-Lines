import { Grid } from '../src/Index';

describe('Grid test', () => {
    it('Contructor', () => {
        expect(() => {
            new Grid(null as any, 500, 20);
        }).toThrowError(Error);
        expect(() => {
            new Grid(500, null as any, 20);
        }).toThrowError(Error);
        expect(() => {
            new Grid(500, 500, null as any);
        }).toThrowError(Error);
    });

    let grid = new Grid(500, 500, 20);

    it('Columns and Rows', () => {
        expect(grid.Columns).toEqual(25);
        expect(grid.Rows).toEqual(25);
    });

    it('Points', () => {
        expect(grid.Cells.length).toEqual(25);
        expect(grid.Cells[0].length).toEqual(25);
    });
});
