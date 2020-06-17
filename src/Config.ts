import { IModeConstructor } from './Modes/IMode';
import { IRendererConstructor } from './Renderers/IRenderer';

export class Config {
    Width: number;
    Height: number;
    CellSize: number;
    Mode: IModeConstructor;

    ModeConfig?: any;
    Renderer?: IRendererConstructor;
    RendererConfig?: any;
    Seed?: number;

    constructor(
        width: number,
        height: number,
        cellSize: number,
        mode: IModeConstructor,
        modeConfig?: any,
        renderer?: IRendererConstructor,
        rendererConfig?: any,
        seed?: number
    ) {
        this.Height = height;
        this.Width = width;
        this.CellSize = cellSize;
        this.Mode = mode;

        this.ModeConfig = modeConfig;
        this.Renderer = renderer;
        this.RendererConfig = rendererConfig;
        this.Seed = seed;
    }
}
