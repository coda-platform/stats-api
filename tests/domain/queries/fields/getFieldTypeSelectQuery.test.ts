import getFieldTypeSelectQuery from "../../../../src/domain/queries/fields/getFieldTypeSelectQuery";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother";
import resourceArrayFields from "../../../../src/domain/resourceArrayFields";

describe('getFieldTypeSelectQuery tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    });

    it('uses field path for query', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const query = getFieldTypeSelectQuery.getQuery(field);

        // ASSERT
        expect(query).toEqual("jsonb_typeof(resource->'gender') AS gender");
    });

    it('compiles level field path with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country', 'address_country', 'string');

        // ACT
        const query = getFieldTypeSelectQuery.getQuery(field);

        // ASSERT
        expect(query).toEqual("jsonb_typeof(resource->'address'->'country') AS address_country");
    });

    it('compiles level field path two levels deep with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'address_country_name', 'string');

        // ACT
        const query = getFieldTypeSelectQuery.getQuery(field);

        // ASSERT
        expect(query).toEqual("jsonb_typeof(resource->'address'->'country'->'name') AS address_country_name");
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const field = fieldObjectMother.get("gender'--drop", 'gender', 'string');

        // ACT
        const query = getFieldTypeSelectQuery.getQuery(field);

        // ASSERT
        expect(query).toEqual("jsonb_typeof(resource->'gender') AS gender");
    });
});