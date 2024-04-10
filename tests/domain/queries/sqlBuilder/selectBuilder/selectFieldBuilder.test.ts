import selectFieldBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFieldBuilder";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import ConditionObjectMother from "../../../../utils/objectMothers/models/ConditionObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectFieldBuilder tests', () => {

    const selector = selectorObjectMother.get('Observation', 'obs', [], ConditionObjectMother.get(ConditionOperator.and, []));

    it('gets json field as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('field1.field2.field3', 'field1_field2_field3', 'string');

        // ACT
        const result = selectFieldBuilder.build(field, selector);

        // ASSERT
        expect(result).toEqual("resource->'field1'->'field2'->>'field3' AS field1_field2_field3");
    });

    it('with array field, gets json field array formatted as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('code.coding.code', 'code_coding_code', 'string');

        // ACT
        const result = selectFieldBuilder.build(field, selector);

        // ASSERT
        expect(result).toEqual("jsonb_array_elements(resource->'code'->'coding')->>'code' AS code_coding_code");
    });

    it('gets age field from calculated fields', () => {
        // ARRANGE
        const patientSelector = selectorObjectMother.get('Patient', 'pat', [], ConditionObjectMother.get(ConditionOperator.and, []));
        const field = fieldObjectMother.get('age', 'age', 'integer');

        // ACT
        const result = selectFieldBuilder.build(field, patientSelector);

        // ASSERT
        expect(result).toEqual("CASE WHEN resource->'deceased'->>'dateTime' IS NULL THEN CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->>'birthDate')))END ELSE CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate'))) END END as age");
    });
});