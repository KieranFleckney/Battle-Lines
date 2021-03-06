import { Grid } from '../Grid/Grid.js';

export interface IMode {
    Battle(grid: Grid, args?: any): Grid;
}

export interface IModeConstructor {
    new (config: any): IMode;
}
