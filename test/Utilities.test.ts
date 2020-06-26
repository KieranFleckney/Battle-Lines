import { IsOdd } from '../src/Index';

describe('Utilities test', () => {
    describe('Is Odd', () => {
        it('Integer', () => {
            expect(IsOdd(1)).toEqual(true);
            expect(IsOdd(2)).toEqual(false);
            expect(IsOdd(83)).toEqual(true);
            expect(IsOdd(56)).toEqual(false);
        });

        it('Floating Point', () => {
            expect(IsOdd(1.5)).toEqual(true);
            expect(IsOdd(101.101)).toEqual(true);
        });

        it('Negative', () => {
            expect(IsOdd(-20)).toEqual(false);
            expect(IsOdd(-35)).toEqual(true);

            expect(IsOdd(-11.11)).toEqual(true);
        });

        it('Not Number', () => {
            expect(null as any).toThrowError(Error);
        });
    });
});
