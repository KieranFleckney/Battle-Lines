import { Grid } from '../Grid/Grid';

export interface IMode {
    Battle(grid: Grid, args?: Array<any>): Grid;
    // ApplyConfig(config: any): void;
}

export interface IModeConstructor {
    new (config: any): IMode;
}

// export abstract class BaseMode implements IMode {
//     constructor(config: any) {

//     }
//     abstract Battle(grid: Grid, args?: Array<any>): Grid;
// }
