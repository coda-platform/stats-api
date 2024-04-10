import arrayFieldDetector from "../../../../src/domain/queries/fields/arrayFieldDetector";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import ConditionObjectMother from "../../../utils/objectMothers/models/ConditionObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('arrayFieldDetector tests', () => {

    const emptyCondition = ConditionObjectMother.get(ConditionOperator.and, []);

    it('With all elements in path not an array elements, field is not array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], emptyCondition);

        // ACT
        const isArray = arrayFieldDetector.isArrayField('birthdate.notanarray', selector);

        // ASSERT
        expect(isArray).toBeFalsy();
    });

    it('With first element in path as array element, field is array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], emptyCondition);

        // ACT
        const isArray = arrayFieldDetector.isArrayField('name.isArray', selector);

        // ASSERT
        expect(isArray).toBeTruthy();
    });

    it('With second element in path as array element, field is array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Observation', 'observation', [], emptyCondition);

        // ACT
        const isArray = arrayFieldDetector.isArrayField('code.coding', selector);

        // ASSERT
        expect(isArray).toBeTruthy();
    });

    it('With multiple elements in path as array element, field is array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], emptyCondition);

        // ACT
        const isArray = arrayFieldDetector.isArrayField('name.given', selector);

        // ASSERT
        expect(isArray).toBeTruthy();
    });
});