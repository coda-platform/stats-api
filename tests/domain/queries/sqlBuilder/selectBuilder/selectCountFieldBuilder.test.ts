import selectCountFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectCountFieldBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectCountFieldBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    });

    it('counts json field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country', 'string');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});

        // ACT
        const result = selectCountFieldBuilder.build(field, patientSelector);

        // ASSERT
        expect(result).toEqual("count(resource->'address'->'country'->>'name')");
    });

    it('with array field, counts json field array formatted with fields label . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country.name', 'string');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});

        resourceArrayFields.values = ['address.country'];

        // ACT
        const result = selectCountFieldBuilder.build(field, patientSelector);

        // ASSERT
        expect(result).toEqual("count(country_name)");
    });
});