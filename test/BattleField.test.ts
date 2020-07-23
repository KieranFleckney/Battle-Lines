import { BattleField } from '../src/Index';

describe('BattleField test', () => {
    it('Calculate Lenght', () => {
        let battleField = new BattleField(10, 20);
        expect(battleField.CalculateLenght()).toEqual(11);
    });
});
