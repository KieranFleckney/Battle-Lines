export class BattleField {
    Start: number;
    End: number;

    constructor(start: number, end: number) {
        this.Start = start;
        this.End = end;
    }

    CalculateLenght(): number {
        return this.End - this.Start + 1;
    }
}
