import selectCountAllBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectCountAllBuilder";

describe('selectCountAllBuilder tests', () => {
    it('returns count(*)', () => {
        expect(selectCountAllBuilder.build()).toEqual('count(*)');
    });
});