import { ConditionOperator } from "../../../../../../src/models/request/conditionOperator";
import crossJoinFieldLevelBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/crossJoin/crossJoinFieldLevelBuilderObjectMother";
import ConditionObjectMother from "../../../../../utils/objectMothers/models/ConditionObjectMother";
import selectorObjectMother from "../../../../../utils/objectMothers/models/selectorObjectMother";

describe('CrossJoinFieldLevelBuilder tests', () => {

    const patientSelector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, []));

    it('with no array field path element, has no remaining path to build', () => {
        // ARRANGE
        const builder = crossJoinFieldLevelBuilderObjectMother.get('gender', 'gender', patientSelector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with one array element in path, field is constructed and has no remaning path to build', () => {
        // ARRANGE
        const builder = crossJoinFieldLevelBuilderObjectMother.get('address.city', 'address.city', patientSelector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'address') AS patient_address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two array elements in path, field is constructed in two steps and has no remaining path to build', () => {
        // ARRANGE
        const builder = crossJoinFieldLevelBuilderObjectMother.get('name.given.name', 'name.given.name', patientSelector);

        const levelAFieldPath = builder.buildCurrentLevel();
        expect(builder.hasRemainingPathToBuild()).toBeTruthy();


        // ACT
        const levelBFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(levelAFieldPath).toEqual("jsonb_array_elements(resource->'name') AS patient_name");
        expect(levelBFieldPath).toEqual("jsonb_array_elements(name->'given') AS patient_name_given");

        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });
});