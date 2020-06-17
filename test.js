const IRLG = require('./dist-cjs/Index.js');

let gridParamture = new IRLG.GridConfig(1000, 1000, 10, 10);
let grid = new IRLG.IRLG(gridParamture);

grid.Grid.Renderer.Draw(grid.Grid.Points);
