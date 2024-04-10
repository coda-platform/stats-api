import jsonTypePathCompiler from "../../../src/domain/queries/jsonTypePathCompiler";
import { ConditionOperator } from "../../../src/models/request/conditionOperator";
import ConditionObjectMother from "../../utils/objectMothers/models/ConditionObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";

describe('jsonTypePathCompiler tests', () => {

    const emptyCondition = ConditionObjectMother.get(ConditionOperator.and, []);

    it('it combines resource with field path', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender', 'gender', 'string');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path, patientSelector);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(resource->'gender')");
    });

    it('compiles level field path with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('test.test', 'test', 'string');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path, patientSelector);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(resource->'test'->'test')");
    });

    it('compiles level field path two levels deep with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('test.test.test', 'test', 'string');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path, patientSelector);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(resource->'test'->'test'->'test')");
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const field = fieldObjectMother.get("gender'--drop", 'inject', 'string');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path, patientSelector);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(resource->'gender')");
    });

    it('when value is array, field is wrapped with jsonb_array_elements', () => {
        // ARRANGE
        const field = fieldObjectMother.get('name', 'name', 'string');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path, patientSelector);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(jsonb_array_elements(resource->'name'))");
    });

    it('when multiple values are arrays, appropriate portions of path are wrapped with jsonb_array_elements', () => {
        // ARRANGE
        const field = fieldObjectMother.get('diagnosis.condition.coding', 'diagnosis', 'string');
        const patientSelector = selectorObjectMother.get('Encounter', 'encounter', [field], emptyCondition);

        // ACT
        const pathCompiled = jsonTypePathCompiler.getPathCompiled(field.path, patientSelector);

        // ASSERT
        expect(pathCompiled).toEqual("jsonb_typeof(jsonb_array_elements(jsonb_array_elements(resource->'diagnosis')->'condition'->'coding'))");
    });
});