import selectFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFieldBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";

describe('selectFieldBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    });

    it('gets json field as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'address_country_name', 'string');

        // ACT
        const result = selectFieldBuilder.build(field);

        // ASSERT
        expect(result).toEqual("resource->'address'->'country'->>'name' AS address_country_name");
    });

    it('with array field, gets json field array formatted as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'address_country_name', 'string');

        resourceArrayFields.values = ['address.country'];

        // ACT
        const result = selectFieldBuilder.build(field);

        // ASSERT
        expect(result).toEqual("jsonb_array_elements(resource->'address'->'country')->>'name' AS address_country_name");
    });

    it('gets age field from calculated fields', () => {
        // ARRANGE
        const field = fieldObjectMother.get('age', 'age', 'integer');

        // ACT
        const result = selectFieldBuilder.build(field);

        // ASSERT
        expect(result).toEqual("CASE WHEN resource->'deceased'->>'dateTime' IS NULL OR resource->'deceased'->>'dateTime' = 'NaT' THEN CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->>'birthDate')))END ELSE CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate'))) END END as age");
    });
});