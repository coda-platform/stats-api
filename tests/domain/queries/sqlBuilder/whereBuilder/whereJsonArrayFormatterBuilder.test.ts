import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import whereJsonArrayFormatterBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilder/whereBuilder/whereJsonArrayFormatterBuilderObjectMother";

describe('whereJsonArrayFormatterBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = [];
    });

    it('with with simple fieldPath elements, not array, field with resource returned', () => {
        // ARRANGE
        const builder = whereJsonArrayFormatterBuilderObjectMother.get('gender', 'patient');

        // ACT
        const result = builder.build();

        // ASSERT
        expect(result).toEqual("resource->>'gender'");
    });

    it('with sub path, not array, field path from resource returned', () => {
        // ARRANGE
        const builder = whereJsonArrayFormatterBuilderObjectMother.get('address.country', 'patient');

        // ACT
        const result = builder.build();

        // ASSERT
        expect(result).toEqual("resource->'address'->>'country'");
    });

    it('with two level sub path, not array, field path from resource returned', () => {
        // ARRANGE
        const builder = whereJsonArrayFormatterBuilderObjectMother.get('address.country.name', 'patient');

        // ACT
        const result = builder.build();

        // ASSERT
        expect(result).toEqual("resource->'address'->'country'->>'name'");
    });

    it('with two level sub path, array at first field path, only first is unrolled', () => {
        // ARRANGE
        const builder = whereJsonArrayFormatterBuilderObjectMother.get('address.country.name', 'patient');
        resourceArrayFields.values = ['address'];

        // ACT
        const currentLevelFieldPath = builder.build();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("patient_table.resource->'address'");
    });

    it('with two level sub path, array at second field path, first two path unrolled', () => {
        // ARRANGE
        const builder = whereJsonArrayFormatterBuilderObjectMother.get('address.country.name', 'patient');
        resourceArrayFields.values = ['address.country'];

        // ACT
        const currentLevelFieldPath = builder.build();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("patient_table.resource->'address'->'country'");
    });

    // it('when upper case characters, characters that are combined are lower cased', () => {
    //     // ARRANGE
    //     const builder = whereJsonArrayFormatterBuilderObjectMother.get('Address.Country.Name', 'patient');
    //     resourceArrayFields.values = ['Address.Country'];

    //     // ACT
    //     const currentLevelFieldPath = builder.build();

    //     // ASSERT
    //     expect(currentLevelFieldPath).toEqual("address_country->>'Name'");
    // })

    it('with two level sub path, stop at array portion, field type is array at element 2, all elements are combined with _', () => {
        // ARRANGE
        const builder = whereJsonArrayFormatterBuilderObjectMother.get('address.country.name', 'patient');
        resourceArrayFields.values = ['address.country.name'];

        // ACT
        const currentLevelFieldPath = builder.build();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("patient_table.resource->'address'->'country'");
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const builder = whereJsonArrayFormatterBuilderObjectMother.get("address.country.name'--drop", 'patient');
        resourceArrayFields.values = ['address.country.name'];

        // ACT
        const currentLevelFieldPath = builder.build();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("patient_table.resource->'address'->'country'");
    });

    it('real case query with two arrays', () => {
        // ARRANGE
        const builder = whereJsonArrayFormatterBuilderObjectMother.get('interpretation.coding.display', 'observation');
        resourceArrayFields.values = ['interpretation', 'interpretation.coding'];

        // ACT
        const result = builder.build();

        // ASSERT
        expect(result).toEqual("observation_table.resource->'interpretation'");
    });
});