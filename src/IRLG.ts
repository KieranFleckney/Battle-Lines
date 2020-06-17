import { GridConfig } from './Grid-Config';
import { Grid } from './Grid';
import { IRenderer } from './IRenderer';

export class IRLG {
    Grid: Grid;

    constructor(config: GridConfig, renderer?: IRenderer) {
        this.Grid = new Grid(config, renderer);
    }
}

// Added this for UMD bundle, don't look at me like that.
export function New(config: GridConfig, renderer?: IRenderer): IRLG {
    let newIRLG = new IRLG(config, renderer);
    return newIRLG;
}

export { GridConfig } from './Grid-Config';
