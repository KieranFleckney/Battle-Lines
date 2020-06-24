import { Cell } from '../Grid/Cell';

export interface IRenderer {
    Draw(points: Array<Array<Cell>>, args?: any): void;
    Export(opt?: any): any;
}

export interface IRendererConstructor {
    new (config: any): IRenderer;
}
