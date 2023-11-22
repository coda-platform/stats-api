import resourceArrayFields from "../../../../../../src/domain/resourceArrayFields";
import crossJoinFieldLevelBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/crossJoin/crossJoinFieldLevelBuilderObjectMother";

describe('CrossJoinFieldLevelBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = [];
    });

    it('with no array field path element, has no remaining path to build', () => {
        // ARRANGE
        const builder = crossJoinFieldLevelBuilderObjectMother.get('gender', 'gender');

        // ACT
        const hasRemaining = builder.hasRemainingPathToBuild();

        // ASSERT
        expect(hasRemaining).toBeFalsy();
    });

    it('with one array element in path, field is constructed and has no remaning path to build', () => {
        // ARRANGE
        const builder = crossJoinFieldLevelBuilderObjectMother.get('address.city', 'address.city');
        resourceArrayFields.values = ['address'];

        // ACT
        const currentLevelFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(currentLevelFieldPath).toEqual("jsonb_array_elements(resource->'address') AS address");
        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });

    it('with two array elements in path, field is constructed in two steps and has no remaining path to build', () => {
        // ARRANGE
        const builder = crossJoinFieldLevelBuilderObjectMother.get('address.city.name', 'address.city.name');
        resourceArrayFields.values = ['address', 'address.city'];

        const levelAFieldPath = builder.buildCurrentLevel();
        expect(builder.hasRemainingPathToBuild()).toBeTruthy();


        // ACT
        const levelBFieldPath = builder.buildCurrentLevel();

        // ASSERT
        expect(levelAFieldPath).toEqual("jsonb_array_elements(resource->'address') AS address");
        expect(levelBFieldPath).toEqual("jsonb_array_elements(address->'city') AS address_city");

        expect(builder.hasRemainingPathToBuild()).toBeFalsy();
    });
});