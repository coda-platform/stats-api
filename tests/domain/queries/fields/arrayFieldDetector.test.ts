import arrayFieldDetector from "../../../../src/domain/queries/fields/arrayFieldDetector";
import resourceArrayFields from "../../../../src/domain/resourceArrayFields";

describe('arrayFieldDetector tests', () => {
    it('With all elements in path not an array elements, field is not array type', () => {
        // ARRANGE
        resourceArrayFields.values = ['fieldA', 'fieldB'];

        // ACT
        const isArray = arrayFieldDetector.isArrayField('fieldC.fieldD');

        // ASSERT
        expect(isArray).toBeFalsy();
    });

    it('With first element in path as array element, field is array type', () => {
        // ARRANGE
        resourceArrayFields.values = ['fieldA', 'fieldB'];

        // ACT
        const isArray = arrayFieldDetector.isArrayField('fieldA.fieldD');

        // ASSERT
        expect(isArray).toBeTruthy();
    });

    it('With second element in path as array element, field is array type', () => {
        // ARRANGE
        resourceArrayFields.values = ['fieldA', 'fieldC.fieldB'];

        // ACT
        const isArray = arrayFieldDetector.isArrayField('fieldC.fieldB');

        // ASSERT
        expect(isArray).toBeTruthy();
    });

    it('With multiple elements in path as array element, field is array type', () => {
        // ARRANGE
        resourceArrayFields.values = ['fieldA', 'fieldA.fieldB'];

        // ACT
        const isArray = arrayFieldDetector.isArrayField('fieldA.fieldB');

        // ASSERT
        expect(isArray).toBeTruthy();
    });
});