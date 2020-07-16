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
    Horizontal: boolean;

    /**
     *
     * @param width Width of canvas
     * @param height Height of canvas
     * @param cellSize Size of each cell in pixels
     * @param mode Pattern generate mode
     * @param modeConfig (Optional) Config options for the mode
     * @param renderer Renderer you like to use to display the output
     * @param rendererConfig (Optional) Config options for the renderer
     * @param seed (Optional) Seed for the random number generate
     */
    constructor(
        width: number,
        height: number,
        cellSize: number,
        mode: IModeConstructor,
        modeConfig?: any,
        renderer?: IRendererConstructor,
        rendererConfig?: any,
        seed?: number,
        horizontal: boolean = false
    ) {
        this.Height = height;
        this.Width = width;
        this.CellSize = cellSize;
        this.Mode = mode;

        this.ModeConfig = modeConfig;
        this.Renderer = renderer;
        this.RendererConfig = rendererConfig;
        this.Seed = seed;
        this.Horizontal = horizontal;
    }
}
