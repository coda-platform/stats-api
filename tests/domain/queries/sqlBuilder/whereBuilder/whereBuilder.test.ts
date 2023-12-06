import whereBuilder from "../../../../../src/domain/queries/sqlBuilder/whereBuilder/whereBuilder";

describe('whereBuilder tests', () => {
    it('return WHERE', () => {
        expect(whereBuilder.build()).toEqual("WHERE");
    });
});