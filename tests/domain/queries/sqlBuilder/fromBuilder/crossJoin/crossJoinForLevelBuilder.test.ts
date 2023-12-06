import resourceArrayFields from "../../../../../../src/domain/resourceArrayFields";
import { ConditionOperator } from "../../../../../../src/models/request/conditionOperator";
import crossJoinForLevelBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/crossJoin/crossJoinForLevelBuilderObjectMother";
import fieldObjectMother from "../../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../../utils/objectMothers/models/selectorObjectMother";

describe('CrossJoinForLevelBuilder tests', () => {
    const maleGenderFilter = filterObjectMother.get('gender', 'is', 'male', 'string');
    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const cityFilter = filterObjectMother.get('address.city', 'is', 'Quebec', 'string');
    const countryFilter = filterObjectMother.get('address.country', 'is', 'Quebec', 'string');

    beforeEach(() => {
        resourceArrayFields.values = [];
    });

    it('with no filter, has no remaining path to build', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with filter, no array in filter, has no remaining path to build', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[cityFilter]});
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two filters, one array in each, builds in one level', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[maleGenderFilter, cityFilter]});
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['gender', 'address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'gender') AS gender, jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with one filter and field, one array in each, builds in one level', () => {
        // ARRANGE
        const genderField = fieldObjectMother.get('gender', 'gender', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[cityFilter]});
        const builder = crossJoinForLevelBuilderObjectMother.get(selector, genderField);

        resourceArrayFields.values = ['gender', 'address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'gender') AS gender, jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two filters, one array in each, array of each yield same field, field is only included once', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[cityFilter, countryFilter]});
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['gender', 'address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two filters and field, one array in each, array of each yield same field, field is only included once', () => {
        // ARRANGE
        const cityField = fieldObjectMother.get('address.city', 'city', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[cityFilter, countryFilter]});
        const builder = crossJoinForLevelBuilderObjectMother.get(selector, cityField);

        resourceArrayFields.values = ['gender', 'address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two filters, array in second, builds in one level with only filter that has array', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[maleGenderFilter, cityFilter]});
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['address'];


        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two filters, same field in filter, filter is only once in cross join', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[maleGenderFilter, femaleGenderFilter]});
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['gender'];


        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'gender') AS gender");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two arrays in filter, builds in two level', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[maleGenderFilter, cityFilter]});
        const builder = crossJoinForLevelBuilderObjectMother.get(selector);

        resourceArrayFields.values = ['address', 'address.city'];

        const levelAPath = builder.buildCurrentLevel();
        expect(builder.hasRemainingPathToBuild()).toBeTruthy();

        // ACT
        const levelBPath = builder.buildCurrentLevel();

        // ASSERT
        expect(levelAPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS address");
        expect(levelBPath).toEqual("CROSS JOIN LATERAL jsonb_array_elements(address->'city') AS address_city");

        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });
});