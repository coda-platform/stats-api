import groupByCompiledFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/groupByBuilder/groupByCompiledFieldBuilder";

describe('groupByCompiledFieldBuilder tests', () => {
    it('Gets field path formatted with subquery prefix', () => {
        // ARRANGE
        const compiledName = 'period_start';

        // ACT
        const result = groupByCompiledFieldBuilder.build(compiledName);

        // ASSERT
        expect(result).toEqual(compiledName);
    });
});