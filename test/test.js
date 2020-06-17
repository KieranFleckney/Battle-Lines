const IRLG = require('../dist-cjs/Index');

let gridParamture = new IRLG.Config(1000, 1000, 20, IRLG.ClashMode, { BattleFieldSize: 20 });
let grid = new IRLG.IRLG(gridParamture);
grid.Next();
grid.Draw();
