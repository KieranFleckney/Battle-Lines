/**
 * @param value Value to check is odd
 * @returns true or false
 */
export function IsOdd(value: number): boolean {
    if (value % 2 == 1) {
        return true;
    } else {
        return false;
    }
}

/**
 * Will randomly generate a num between 0 and 1
 * @param max (Optional) Max number to generated
 * @param min (Optional) Min number to generate
 * @param floor (Optional) round down the result
 */
export function Rand(max?: number, min?: number, floor: boolean = false): number {
    max = max || 1;
    let newNum;
    if (min) {
        let newMax = max - min;
        newNum = Math.random() * newMax;
        newNum += min;
    } else {
        newNum = Math.random() * max;
    }

    if (floor) {
        newNum = Math.floor(newNum);
    }

    return newNum;
}

// http://indiegamr.com/generate-repeatable-random-numbers-in-js/ works as needed with out too complicated maths or external libiary

export class SeedRand {
    OSeed: number;
    Seed: number;
    Max: number;
    Min: number;

    /**
     * Will randomly generate a number between 0 and 1 based on a seed
     * @param seed (Optional) Seed of the random generator
     * @param max (Optional) Max number to generated
     * @param min (Optional) Min number to generate
     */
    constructor(seed?: number, max?: number, min?: number) {
        this.OSeed = seed || Rand(1000000);
        this.Seed = this.OSeed;
        this.Min = min || 0;
        this.Max = max || 1;
    }

    /**
     * Give you the next random number in the seed
     */
    Next() {
        this.Seed = (this.Seed * 9301 + 49297) % 233280;
        var rnd = this.Seed / 233280;

        return this.Min + rnd * (this.Max - this.Min);
    }
}
