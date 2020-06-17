import { Cell } from '../Grid/Cell';

export interface IRenderer {
    Draw(points: Array<Array<Cell>>, args?: any): void;
}

export interface IRendererConstructor {
    new (config: any): IRenderer;
}
