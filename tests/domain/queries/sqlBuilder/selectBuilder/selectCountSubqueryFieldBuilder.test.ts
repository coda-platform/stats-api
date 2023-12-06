import selectCountSubqueryFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectCountSubqueryFieldBuilder";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";

describe('selectCountSubqueryFieldBuilder tests', () => {
    it('get fields path . replaced with _ and subquery name and count function', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country', 'string');

        // ACT
        const result = selectCountSubqueryFieldBuilder.build(field, 'SQ');

        // ASSERT
        expect(result).toEqual('count(SQ.address_country_name)');
    });
});