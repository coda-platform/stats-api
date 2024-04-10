import fromCrossJoinBuilder from "../../../../../src/domain/queries/sqlBuilder/fromBuilder/fromCrossJoinBuilder";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import { when } from "jest-when";

describe('fromCrossJoinBuilder tests', () => {
    const genderFilter = filterObjectMother.get('gender', 'is', 'male', 'string');
    const cityFilter = filterObjectMother.get('address.city', 'is', 'Quebec', 'string');
    const conditionFilter = filterObjectMother.get('code.coding', 'is', 'test', 'string');
    const conditionField = fieldObjectMother.get('code.coding', 'code.coding', 'string');

    beforeEach(() => {

    })

    it('with one filter array type, array element is last path element, field is added in CROSS JOIN LATERAL', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[conditionFilter]});

        // ACT
        const query = fromCrossJoinBuilder.build(selector);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'code'->'coding') AS observation_code_coding");
    });

    it('with one field array type, with field and no filter, array element is last path element, field is added in CROSS JOIN LATERAL', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Observation', 'obs', [conditionField], {conditionOperator:ConditionOperator.and, conditions:[]});

        // ACT
        const query = fromCrossJoinBuilder.build(selector, conditionField);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'code'->'coding') AS obs_code_coding");
    });

    it('with one filter array type, array element is first path element, only array portion is in CROSS JOIN', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[cityFilter]});

        resourceArrayFields.get = jest.fn();
        when(resourceArrayFields.get as any)
            .mockReturnValue(['address']);

        // ACT
        const query = fromCrossJoinBuilder.build(selector);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS patient_address");
    });

    it('with two fields array types, filters are added in CROSS JOIN LATERAL', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[genderFilter, cityFilter]});

        resourceArrayFields.get = jest.fn();
        when(resourceArrayFields.get as any)
            .mockReturnValue(["address.city", "gender"]);

        // ACT
        const query = fromCrossJoinBuilder.build(selector);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'gender') AS patient_gender, jsonb_array_elements(resource->'address'->'city') AS patient_address_city");
    });

    it('with two arrays in filter, two cross joins are generated', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[cityFilter]});

        resourceArrayFields.get = jest.fn();
        when(resourceArrayFields.get as any)
            .mockReturnValue(["address", "address.city"]);

        // ACT
        const query = fromCrossJoinBuilder.build(selector);

        // ASSERT
        expect(query).toEqual("CROSS JOIN LATERAL jsonb_array_elements(resource->'address') AS patient_address CROSS JOIN LATERAL jsonb_array_elements(address->'city') AS patient_address_city");
    });
});