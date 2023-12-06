import selectCountAllBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectCountAllBuilder";
import selectNamedCountAllBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectNamedCountAllBuilder";

describe('selectNamedCountAllBuilder tests', () => {
    it('returns count(*) AS name', () => {
        expect(selectNamedCountAllBuilder.build('name')).toEqual('count(*) AS name');
    });
});