import jsonValuePathCompiler from "../../../src/domain/queries/jsonFieldValuePathCompiler";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import resourceArrayFields from "../../../src/domain/resourceArrayFields";

describe('jsonValuePathCompiler tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = [];
    });

    it('it combines resource with field path joins by json value getter', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const pathCompiled = jsonValuePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("resource->>'gender'");
    });

    it('compiles level field path with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country', 'country', 'string');

        // ACT
        const pathCompiled = jsonValuePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("resource->'address'->>'country'");
    });

    it('compiles level field path two levels deep with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country_name', 'string');

        // ACT
        const pathCompiled = jsonValuePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("resource->'address'->'country'->>'name'");
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const field = fieldObjectMother.get("gender'--drop", 'inject', 'string');

        // ACT
        const pathCompiled = jsonValuePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("resource->>'gender'");
    });

    it('when value is array, field is wrapped with jsonb_array_elements and is not explicitly json untyped', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        resourceArrayFields.values = ["gender"];

        // ACT
        const pathCompiled = jsonValuePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_array_elements(resource->'gender')");
    });

    it('when multiple values are arrays, appropriate portions of path are wrapped with jsonb_array_elements', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country_name', 'string');

        resourceArrayFields.values = ["address", "address.country"];


        // ACT
        const pathCompiled = jsonValuePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_array_elements(jsonb_array_elements(resource->'address')->'country')->>'name'");
    });

    it('when multiple values are arrays, last path element is array, json value is returned instead of typed', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country_name', 'string');

        resourceArrayFields.values = ["address", "address.country.name"];


        // ACT
        const pathCompiled = jsonValuePathCompiler.getPathCompiled(field.path);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_array_elements(jsonb_array_elements(resource->'address')->'country'->'name')");
    });
});