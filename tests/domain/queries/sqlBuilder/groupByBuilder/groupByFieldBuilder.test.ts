import groupByFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/groupByBuilder/groupByFieldBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import ConditionObjectMother from "../../../../utils/objectMothers/models/ConditionObjectMother";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";

describe('groupByFieldBuilder tests', () => {
    
    const selector = selectorObjectMother.get('Observation', 'obs', [], ConditionObjectMother.get(ConditionOperator.and, []));

    it('Gets json field path formatted', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country', 'string');

        // ACT
        const result = groupByFieldBuilder.build(field, selector);

        // ASSERT
        expect(result).toEqual("resource->'address'->'country'->>'name'");
    });

    it('Gets json array field path formatted', () => {
        // ARRANGE
        const field = fieldObjectMother.get('code.coding.code', 'code', 'string');

        // ACT
        const result = groupByFieldBuilder.build(field, selector);

        // ASSERT
        expect(result).toEqual("jsonb_array_elements(resource->'code'->'coding')->>'code'");
    });
});