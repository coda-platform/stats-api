import { ConditionOperator } from "../../../../../../src/models/request/conditionOperator";
import jsonFieldValueForLevelBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/crossJoin/jsonFieldValueForLevelBuilderObjectMother";
import ConditionObjectMother from "../../../../../utils/objectMothers/models/ConditionObjectMother";
import selectorObjectMother from "../../../../../utils/objectMothers/models/selectorObjectMother";

describe('jsonFieldValueForLevelBuilder tests', () => {

    const selector = selectorObjectMother.get('Observation', 'obs', [], ConditionObjectMother.get(ConditionOperator.and, []));
    const patientSelector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, []));

    it('with with simple fieldPath elements, no level built, has no remaining path to build', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('gender', selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with with simple fieldPath elements, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('gender', selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with sub path, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.country', selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two level sub path, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.country.name', selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 0, only first element of path included', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.country.name', patientSelector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'address')");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 1, deepest path is not included', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('code.coding.code', selector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'code'->'coding')");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 2, all path included', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('value.CodeableConcept.coding', selector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'value'->'CodeableConcept'->'coding')");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('when building path with two arrays, path is build in two steps with compiled names for following paths.', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('name.given.test', patientSelector);

        const levelAPath = builder.buildCurrentLevel();
        expect(builder.hasRemainingPathToBuild()).toBeTruthy();

        // ACT
        const levelBPath = builder.buildCurrentLevel();

        // ASSERT
        expect(levelAPath).toEqual("jsonb_array_elements(resource->'name')");
        expect(levelBPath).toEqual("jsonb_array_elements(name->'given')");

        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with sub path, not array, upper case char, simple resource path chaining with same casing', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('test.TEST', selector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("resource->'test'->'TEST'");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get("name'--drop", patientSelector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'name')");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });
});