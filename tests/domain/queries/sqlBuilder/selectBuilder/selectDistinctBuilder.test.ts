import selectDistinctBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectDistinctBuilder";

describe('selectDistinctBuilder tests', () => {
    it('return DISTINCT', () => {
        expect(selectDistinctBuilder.build()).toEqual("DISTINCT");
    });
});