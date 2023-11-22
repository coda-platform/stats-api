import selectSubqueryFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectSubqueryFieldBuilder";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";

describe('selectSubqueryFieldBuilder tests', () => {
    it('get fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country', 'string');

        // ACT
        const result = selectSubqueryFieldBuilder.build(field, 'SQ');

        // ASSERT
        expect(result).toEqual('SQ.address_country_name');
    });
});