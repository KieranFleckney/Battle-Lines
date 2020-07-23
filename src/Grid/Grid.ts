import { Cell } from './Cell.js';

export class Grid {
    Rows: number;
    Columns: number;
    Cells: Array<Array<Cell>>;

    /**
     * Grid calculates the row and columns and generates the array of cells
     * @param width Width of canvas
     * @param height Height of canvas
     * @param cellSize Size of each cell in pixels
     */
    constructor(width: number, height: number, cellSize: number) {
        if (!width) {
            throw new Error('Missing width');
        }

        if (!height) {
            throw new Error('Missing height');
        }

        if (!cellSize) {
            throw new Error('Missing cellSize');
        }

        this.Rows = 0;
        this.Columns = 0;
        this.Cells = new Array<Array<Cell>>();

        this.Regenerate(width, height, cellSize);
    }

    private CalculateRow(height: number, pointSize: number): number {
        return Math.floor(height / pointSize);
    }

    private CalculateColumns(width: number, pointSize: number): number {
        return Math.floor(width / pointSize);
    }

    private GenertatePoints(): void {
        for (let y = 1; y <= this.Rows; y++) {
            this.Cells.push(new Array<Cell>());
            for (let x = 1; x <= this.Columns; x++) {
                this.Cells[y - 1][x - 1] = new Cell(x, y);
            }
        }
    }

    Regenerate(width: number, height: number, cellSize: number) {
        this.Columns = this.CalculateColumns(width, cellSize);
        this.Rows = this.CalculateRow(height, cellSize);
        this.Cells = new Array<Array<Cell>>();

        this.GenertatePoints();
    }
}
