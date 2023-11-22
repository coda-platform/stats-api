import resourceArrayFields from "../../../../../../src/domain/resourceArrayFields";
import jsonFieldValueForLevelBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/crossJoin/jsonFieldValueForLevelBuilderObjectMother";

describe('jsonFieldValueForLevelBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = [];
    });

    it('with with simple fieldPath elements, no level built, has no remaining path to build', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('gender');

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with with simple fieldPath elements, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('gender');

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with sub path, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.country');

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two level sub path, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.country.name');

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 0, only first element of path included', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.country.name');
        resourceArrayFields.values = ['address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'address')");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 1, deepest path is not included', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.country.name');
        resourceArrayFields.values = ['address.country'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'address'->'country')");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 2, all path included', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.country.name');
        resourceArrayFields.values = ['address.country.name'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'address'->'country'->'name')");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('when building path with two arrays, path is build in two steps with compiled names for following paths.', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.country.name');
        resourceArrayFields.values = ['address', 'address.country'];

        const levelAPath = builder.buildCurrentLevel();
        expect(builder.hasRemainingPathToBuild()).toBeTruthy();

        // ACT
        const levelBPath = builder.buildCurrentLevel();

        // ASSERT
        expect(levelAPath).toEqual("jsonb_array_elements(resource->'address')");
        expect(levelBPath).toEqual("jsonb_array_elements(address->'country')");

        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with sub path, not array, upper case char, simple resource path chaining with same casing', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get('address.Country');
        resourceArrayFields.values = ['address.Country'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'address'->'Country')");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const builder = jsonFieldValueForLevelBuilderObjectMother.get("gender'--drop");
        resourceArrayFields.values = ['gender'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'gender')");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });
});