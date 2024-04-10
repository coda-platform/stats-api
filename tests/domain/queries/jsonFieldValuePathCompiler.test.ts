import jsonValuePathCompiler from "../../../src/domain/queries/jsonFieldValuePathCompiler";
import { ConditionOperator } from "../../../src/models/request/conditionOperator";
import ConditionObjectMother from "../../utils/objectMothers/models/ConditionObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";

describe('jsonValuePathCompiler tests', () => {

    const emptyCondition = ConditionObjectMother.get(ConditionOperator.and, []);

    it('it combines resource with field path joins by json value getter', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender', 'gender', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonValuePathCompiler.getFieldPathCompiled(field.path, selector);

        // ASSERT
        expect(pathCompiled).toEqual("resource->>'gender'");
    });

    it('compiles level field path with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('field.test', 'country', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);


        // ACT
        const pathCompiled = jsonValuePathCompiler.getFieldPathCompiled(field.path, selector);

        // ASSERT
        expect(pathCompiled).toEqual("resource->'field'->>'test'");
    });

    it('compiles level field path two levels deep with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('field.test.test', 'country_name', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonValuePathCompiler.getFieldPathCompiled(field.path, selector);

        // ASSERT
        expect(pathCompiled).toEqual("resource->'field'->'test'->>'test'");
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const field = fieldObjectMother.get("gender'--drop", 'inject', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonValuePathCompiler.getFieldPathCompiled(field.path, selector);

        // ASSERT
        expect(pathCompiled).toEqual("resource->>'gender'");
    });

    it('when value is array, field is wrapped with jsonb_array_elements and is not explicitly json untyped', () => {
        // ARRANGE
        const field = fieldObjectMother.get('name', 'name', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonValuePathCompiler.getFieldPathCompiled(field.path, selector);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_array_elements(resource->'name')");
    });

    it('when multiple values are arrays, appropriate portions of path are wrapped with jsonb_array_elements', () => {
        // ARRANGE
        const field = fieldObjectMother.get('name.given.name', 'name', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);


        // ACT
        const pathCompiled = jsonValuePathCompiler.getFieldPathCompiled(field.path, selector);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_array_elements(jsonb_array_elements(resource->'name')->'given')->>'name'");
    });

    it('when multiple values are arrays, last path element is array, json value is returned instead of typed', () => {
        // ARRANGE
        const field = fieldObjectMother.get('diagnosis.condition.coding', 'diagnosis', 'string');
        const selector = selectorObjectMother.get('Encounter', 'ecnounter', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonValuePathCompiler.getFieldPathCompiled(field.path, selector);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_array_elements(jsonb_array_elements(resource->'diagnosis')->'condition'->'coding')");
    });
});