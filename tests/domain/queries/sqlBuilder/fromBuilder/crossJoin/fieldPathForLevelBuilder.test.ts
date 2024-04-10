import { ConditionOperator } from "../../../../../../src/models/request/conditionOperator";
import fieldPathForLevelBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/crossJoin/fieldPathForLevelBuilderObjectMother";
import ConditionObjectMother from "../../../../../utils/objectMothers/models/ConditionObjectMother";
import selectorObjectMother from "../../../../../utils/objectMothers/models/selectorObjectMother";

describe('fieldPathForLevelBuilder tests', () => {

    const observationSelector = selectorObjectMother.get('Observation', 'obs', [], ConditionObjectMother.get(ConditionOperator.and, []));
    const patientSelector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, []));

    it('with with simple fieldPath elements, no level built, has no remaining path to build', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('gender', patientSelector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with with simple fieldPath elements, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('gender', patientSelector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with sub path, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.country', observationSelector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two level sub path, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.country.name', observationSelector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 0, only first element of path included', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.country.name', patientSelector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('address');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 1, deepest path is not included', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('code.coding.code', observationSelector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('code_coding');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 2, all path included', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('value.CodeableConcept.coding', observationSelector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('value_codeableconcept_coding');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('when building path with two arrays, path is build in two steps.', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('name.given.test', patientSelector);

        const levelAPath = builder.buildCurrentLevel();
        expect(builder.hasRemainingPathToBuild()).toBeTruthy();

        // ACT
        const levelBPath = builder.buildCurrentLevel();

        // ASSERT
        expect(levelAPath).toEqual('name');
        expect(levelBPath).toEqual('name_given');

        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with sub path, not array, replaces . with _ and lower characters', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('code.coding', observationSelector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('code_coding');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get("name'--drop", patientSelector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('name');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });
});