export function IsOdd(value: number): boolean {
    if (value % 2 == 1) {
        return true;
    } else {
        return false;
    }
}

export function Rand(max?: number, min?: number, negtive: boolean = false, floor: boolean = false): number {
    max = max || 1;
    let newNum;
    if (min) {
        let newMax = max - min;
        newNum = Math.random() * newMax;
        newNum += min;
    } else {
        newNum = Math.random() * max;
    }

    if (negtive) {
        newNum -= max / 2;
    }

    if (floor) {
        newNum = Math.floor(newNum);
    }

    return newNum;
}

// http://indiegamr.com/generate-repeatable-random-numbers-in-js/ works as need with out too complicated maths or external libiary
export class SeedRand {
    OSeed: number;
    Seed: number;
    Max: number;
    Min: number;

    constructor(seed?: number, max?: number, min?: number) {
        this.OSeed = seed || Rand(1000000);
        this.Seed = this.OSeed;
        this.Min = min || 1;
        this.Max = max || 0;
    }

    Next() {
        this.Seed = (this.Seed * 9301 + 49297) % 233280;
        var rnd = this.Seed / 233280;

        return this.Min + rnd * (this.Max - this.Min);
    }
}
