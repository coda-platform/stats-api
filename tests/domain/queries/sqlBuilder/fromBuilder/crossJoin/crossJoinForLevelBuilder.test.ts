import { ConditionOperator } from "../../../../../../src/models/request/conditionOperator";
import crossJoinForLevelBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/crossJoin/crossJoinForLevelBuilderObjectMother";
import ConditionObjectMother from "../../../../../utils/objectMothers/models/ConditionObjectMother";
import fieldObjectMother from "../../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../../utils/objectMothers/models/selectorObjectMother";

describe('CrossJoinForLevelBuilder tests', () => {
    const maleGenderFilter = filterObjectMother.get('gender', 'is', 'male', 'string');
    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const cityFilter = filterObjectMother.get('address.city', 'is', 'Quebec', 'string');
    const countryFilter = filterObjectMother.get('address.country', 'is', 'Quebec', 'string');
    const nameFilter = filterObjectMother.get('name', 'is', 'test', 'string');
    const givenNameFilter = filterObjectMother.get('name.given', 'is', 'test', 'string');

    it('with no filter, has no remaining path to build', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, []));
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with filter, no array in filter, has no remaining path to build', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, [femaleGenderFilter]));
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two filters, one array in each, builds in one level', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, [nameFilter, cityFilter]));
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'name') AS patient_name, jsonb_array_elements(resource->'address') AS patient_address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with one filter and field, one array in each, builds in one level', () => {
        // ARRANGE
        const nameField = fieldObjectMother.get('name', 'name', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, [cityFilter]));
        const builder = crossJoinForLevelBuilderObjectMother.get(selector, nameField);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'name') AS patient_name, jsonb_array_elements(resource->'address') AS patient_address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two filters, one array in each, array of each yield same field, field is only included once', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, [cityFilter, countryFilter]));
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS patient_address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two filters and field, one array in each, array of each yield same field, field is only included once', () => {
        // ARRANGE
        const cityField = fieldObjectMother.get('address.city', 'city', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, [cityFilter, countryFilter]));
        const builder = crossJoinForLevelBuilderObjectMother.get(selector, cityField);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS patient_address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two filters, array in second, builds in one level with only filter that has array', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, [maleGenderFilter, cityFilter]));
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS patient_address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two filters, same field in filter, filter is only once in cross join', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, [cityFilter, cityFilter]));
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS patient_address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two arrays in filter, builds in two level', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], ConditionObjectMother.get(ConditionOperator.and, [maleGenderFilter, givenNameFilter]));
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        const levelAPath = builder.buildCurrentLevel();
        expect(builder.hasRemainingPathToBuild()).toBeTruthy();

        // ACT
        const levelBPath = builder.buildCurrentLevel();

        // ASSERT
        expect(levelAPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'name') AS patient_name");
        expect(levelBPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(name->'given') AS patient_name_given");

        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });
});