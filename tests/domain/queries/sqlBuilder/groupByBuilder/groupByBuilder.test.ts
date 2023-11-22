import groupByBuilder from "../../../../../src/domain/queries/sqlBuilder/groupByBuilder/groupByBuilder";

describe('groupByBuilder tests', () => {
    it('return GROUP BY', () => {
        expect(groupByBuilder.build()).toEqual("GROUP BY");
    });
});