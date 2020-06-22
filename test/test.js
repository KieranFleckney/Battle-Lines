const IRLG = require('../dist-cjs/Index');
const IRLG2 = require('../dist-cjs/Utilities/Gradient');

let gridParamture = new IRLG.Config(
    1583,
    1164,
    20,
    IRLG.ClashMode,
    {
        BattleFieldSize: 20,
        // ColourTwoMaxLenghtPercent: 21,
        // ColourTwoChancePercent: 30,
        // ColourOneMaxLenghtPercent: '1%',
    },
    IRLG.TextRenderer,
    {},
    // 132629.73999237482
    // 35946.92809118416
    // 774961.8726039634
    790830.7481158044
);
//let grid = new IRLG.IRLG(gridParamture);
//grid.Next();

let one = '45deg, red, blue';
let two = '135deg, orange, orange 60%, cyan';
let three = 'to right, red 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80%';

let angle = 180;
let rainbow = angle + 'deg , red 20%, orange 20% 40%, yellow 40% 60%, green 60% 80%, blue 80%';

// console.log('one');
// pc(IRLG.ParseGrandientColours(one));
// console.log('two');
// pc(IRLG.ParseGrandientColours(two));
// console.log('three');
// pc(IRLG.ParseGrandientColours(three));

console.log(IRLG2.ParseGrandientAngle(rainbow));
// console.log(IRLG2.ParseGrandientColours(rainbow));

function pc(t) {
    for (const c of t) {
        console.log(c);
    }
}
