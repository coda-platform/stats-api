import getFieldTypeSelectQuery from "../../../../src/domain/queries/fields/getFieldTypeSelectQuery";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import ConditionObjectMother from "../../../utils/objectMothers/models/ConditionObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('getFieldTypeSelectQuery tests', () => {

    const emptyCondition = ConditionObjectMother.get(ConditionOperator.and, []);

    it('uses field path for query', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender', 'gender', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const query = getFieldTypeSelectQuery.getQuery(field, selector);

        // ASSERT
        expect(query).toEqual("jsonb_typeof(resource->'gender') AS gender");
    });

    it('compiles level field path with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('test.country', 'address_country', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const query = getFieldTypeSelectQuery.getQuery(field, selector);

        // ASSERT
        expect(query).toEqual("jsonb_typeof(resource->'test'->'country') AS address_country");
    });

    it('compiles level field path two levels deep with appropriate sql connector', () => {
        // ARRANGE
        const field = fieldObjectMother.get('test.country.name', 'address_country_name', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const query = getFieldTypeSelectQuery.getQuery(field, selector);

        // ASSERT
        expect(query).toEqual("jsonb_typeof(resource->'test'->'country'->'name') AS address_country_name");
    });

    it('escapes field path to avoid sql injections', () => {
        // ARRANGE
        const field = fieldObjectMother.get("gender'--drop", 'gender', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [field], emptyCondition);

        // ACT
        const query = getFieldTypeSelectQuery.getQuery(field, selector);

        // ASSERT
        expect(query).toEqual("jsonb_typeof(resource->'gender') AS gender");
    });
});