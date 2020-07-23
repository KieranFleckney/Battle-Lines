export class BattleField {
    Start: number;
    End: number;

    /**
     * BattleField are areas in which lines are calculated for the pattern
     * @param start Start of battlefield
     * @param end End of battlefield
     */
    constructor(start: number, end: number) {
        this.Start = start;
        this.End = end;
    }

    /**
     * Gives you lenght of battlefield
     */
    CalculateLenght(): number {
        return this.End - this.Start + 1;
    }
}
