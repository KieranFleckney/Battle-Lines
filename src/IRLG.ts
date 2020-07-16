import { Config } from './Config';
import { Grid } from './Grid/Grid';
import { IRenderer } from './Renderers/IRenderer';
import { IMode } from './Modes/IMode';
import { SeedRand } from './Utilities/Utilities';
import { TextRenderer } from './Renderers/TextRenderer';

export class IRLG {
    Grid: Grid;
    private Renderer: IRenderer;
    private Mode: IMode;
    private Random: SeedRand;

    Seed: number;
    CellSize: number;
    Width: number;
    Height: number;

    /**
     * Generates abstract irregular rounded lines
     * @param config
     */
    constructor(config: Config) {
        if (config) {
            this.Random = new SeedRand(config.Seed);
            this.Seed = this.Random.Seed;

            //console.log(this.Random.OSeed);

            if (config.CellSize) {
                this.CellSize = config.CellSize;
            } else {
                throw new Error('Missing "CellSize" from config');
            }

            if (config.Width) {
                this.Width = config.Width;
            } else {
                throw new Error('Missing "Width" from config');
            }

            if (config.Height) {
                this.Height = config.Height;
            } else {
                throw new Error('Missing "Height" from config');
            }

            if (config.Horizontal) {
                this.Height = config.Width;
                this.Width = config.Height;
            }

            if (config.Mode) {
                config.ModeConfig = config.ModeConfig || {};
                config.ModeConfig.Random = this.Random;
                this.Mode = new config.Mode(config.ModeConfig);
            } else {
                throw new Error('Missing "Mode" from config');
            }

            if (config.Renderer) {
                config.RendererConfig = config.RendererConfig || {};
                config.RendererConfig.Random = this.Random;
                config.RendererConfig.Width = this.Width;
                config.RendererConfig.Height = this.Height;
                config.RendererConfig.CellSize = this.CellSize;
                config.RendererConfig.Horizontal = config.Horizontal;
                this.Renderer = new config.Renderer(config.RendererConfig);
            } else {
                this.Renderer = new TextRenderer(null);
            }

            this.Grid = new Grid(this.Width, this.Height, this.CellSize);
        } else {
            throw new Error('Missing config');
        }
    }

    /**
     * Generates next pattern
     */
    Generate() {
        this.Grid = this.Mode.Battle(this.Grid);
    }

    /**
     * Draw the current pattern via renderer
     */
    Draw() {
        this.Renderer.Draw(this.Grid.Cells);
    }

    /**
     * Generates next pattern and then draw via renderer
     */
    Next() {
        this.Generate();
        this.Draw();
    }

    Export(opt?: any) {
        return this.Renderer.Export(opt);
    }
}

// Added this for UMD bundle, don't look at me like that.
export function New(config: Config): IRLG {
    let newIRLG = new IRLG(config);
    return newIRLG;
}
