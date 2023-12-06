import resourceArrayFields from "../../../../../../src/domain/resourceArrayFields";
import fieldPathForLevelBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/crossJoin/fieldPathForLevelBuilderObjectMother";

describe('fieldPathForLevelBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = [];
    });

    it('with with simple fieldPath elements, no level built, has no remaining path to build', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('gender');

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with with simple fieldPath elements, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('gender');

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with sub path, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.country');

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two level sub path, not array, has no remaining path to build', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.country.name');

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 0, only first element of path included', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.country.name');
        resourceArrayFields.values = ['address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('address');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 1, deepest path is not included', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.country.name');
        resourceArrayFields.values = ['address.country'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('address_country');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two level sub path, stop at array portion, field type is array at element 2, all path included', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.country.name');
        resourceArrayFields.values = ['address.country.name'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('address_country_name');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('when building path with two arrays, path is build in two steps.', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.country.name');
        resourceArrayFields.values = ['address', 'address.country'];

        const levelAPath = builder.buildCurrentLevel();
        expect(builder.hasRemainingPathToBuild()).toBeTruthy();

        // ACT
        const levelBPath = builder.buildCurrentLevel();

        // ASSERT
        expect(levelAPath).toEqual('address');
        expect(levelBPath).toEqual('address_country');

        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with sub path, not array, replaces . with _ and lower characters', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get('address.Country');
        resourceArrayFields.values = ['address.Country'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('address_country');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const builder = fieldPathForLevelBuilderObjectMother.get("gender'--drop");
        resourceArrayFields.values = ['gender'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual('gender');
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });
});