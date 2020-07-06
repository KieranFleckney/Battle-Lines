import { IsOdd, IsHexColour, IsCssGradient, Rand, SeedRand, DegToRad, RotateScaleGradient } from '../src/Index';
import {
    ParseGrandientAngle,
    ParseGrandientColours,
    ColourStop,
    CalculateRotateScale,
} from '../src/Utilities/Gradient';

describe('Utilities test', () => {
    describe('Validators', () => {
        it('Is Odd', () => {
            expect(IsOdd(1)).toEqual(true);
            expect(IsOdd(2)).toEqual(false);
            expect(IsOdd(83)).toEqual(true);
            expect(IsOdd(56)).toEqual(false);
            expect(IsOdd(101.101)).toEqual(true);
            expect(IsOdd(1.5)).toEqual(true);
            expect(IsOdd(-20)).toEqual(false);
            expect(IsOdd(-35)).toEqual(true);
            expect(IsOdd(-11.11)).toEqual(true);
            expect(() => {
                IsOdd(null as any);
            }).toThrowError(Error);
            expect(() => {
                IsOdd(undefined as any);
            }).toThrowError(Error);
            expect(() => {
                IsOdd('1' as any);
            }).toThrowError(Error);
        });

        it('Is Hex Colour', () => {
            expect(IsHexColour('#00ff00')).toEqual(true);
            expect(IsHexColour('#fff')).toEqual(false);
            expect(IsHexColour('0000ff')).toEqual(false);
            expect(IsHexColour(null as any)).toEqual(false);
            expect(IsHexColour(undefined as any)).toEqual(false);
        });

        it('Is Css Gradient', () => {
            expect(IsCssGradient('#00ff00')).toEqual(false);
            expect(IsCssGradient('0000ff,#550000')).toEqual(false);
            expect(IsCssGradient('#ff00ff,#00ff00')).toEqual(true);
            expect(IsCssGradient('#ff00ff,#00ff00,#ff00ff')).toEqual(true);
            expect(IsCssGradient('to left, #ff00ff, #00ff00')).toEqual(true);
            expect(IsCssGradient('to top right, #ff00ff, #00ff00,#550000')).toEqual(true);
            expect(IsCssGradient('180deg, #ff00ff, #00ff00')).toEqual(true);
            expect(IsCssGradient(null as any)).toEqual(false);
            expect(IsCssGradient(undefined as any)).toEqual(false);
        });
    });

    describe('randomizers', () => {
        it('Random', () => {
            expect(Rand()).toBeInstanceOf(Number);
            expect(Rand(100)).toBeLessThan(100);
        });

        it('Seeded Random', () => {
            let seed: number = 300620;
            let sRand = new SeedRand(seed);
            expect(sRand).toBeDefined(sRand);
            expect(sRand.Next()).toBeInstanceOf(Number);
            expect(sRand.Next()).toEqual(0.8643432784636488);
            expect(sRand.Next()).not.toEqual(0.8643432784636488);
            sRand.Max = 1000;
            expect(sRand.Next()).toEqual(513.0658436213992);
        });
    });

    describe('Gradients', () => {
        it('Parse Gradient Angle', () => {
            expect(ParseGrandientAngle('to top right, #ff00ff, #00ff00,#550000')).toEqual(5.497787143782138);
            expect(ParseGrandientAngle('180deg, #ff00ff, #00ff00')).toEqual(4.71238898038469);
            expect(ParseGrandientAngle('#ff00ff, #00ff00')).toEqual(1.5707963267948966);
        });

        it('Parse Gradient Colours', () => {
            expect(() => {
                ParseGrandientColours('');
            }).toThrowError(Error, 'No cssGradient provided');

            let parsedColours = ParseGrandientColours('to top right, #ff00ff, #00ff00,#550000');
            let controlledColours = new Array<ColourStop>();
            controlledColours.push(new ColourStop('#ff00ff', 0));
            controlledColours.push(new ColourStop('#00ff00', 0.5));
            controlledColours.push(new ColourStop('#550000', 1));

            expect(parsedColours).toBeInstanceOf(Array);
            expect(parsedColours.length).toEqual(3);
            expect(parsedColours).toEqual(controlledColours);
        });

        it('Calculate Rotation and Scale', () => {
            let calculatedScaleRotation = CalculateRotateScale(180, 500, 500, 500, 500);

            expect(calculatedScaleRotation).toBeInstanceOf(RotateScaleGradient);
            expect(calculatedScaleRotation.TransformMatrix.A).toEqual(-0.8376123159638887);
            expect(calculatedScaleRotation.TransformMatrix.C).toEqual(1.1213034074504158);
            expect(calculatedScaleRotation.LinearGradientParameters.X0).toEqual(-250);
            expect(calculatedScaleRotation.LinearGradientParameters.Y1).toEqual(0);
            expect(calculatedScaleRotation.DrawRectParameters.X).toEqual(-250);
            expect(calculatedScaleRotation.ColourStops).toEqual([]);
        });

        it('Degree to Radians', () => {
            expect(DegToRad(90)).toEqual(1.5707963267948966);
        });
    });
});
