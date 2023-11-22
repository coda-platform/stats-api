import selectFilterTypesBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFilterTypesBuilder";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectFilterTypeBuilder tests', () => {
    it('outputs selector filters as formatedFieldPath', () => {
        // ARRANGE
        const genderFieldFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
        const ageField = filterObjectMother.get('age', 'is', '27', 'integer');

        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[genderFieldFilter, ageField]});

        // ACT
        const result = selectFilterTypesBuilder.build(selector);

        // ASSERT
        expect(result).toEqual("jsonb_typeof(resource->'gender') AS gender, pg_typeof(CASE WHEN resource->'deceased'->>'dateTime' IS NULL OR resource->'deceased'->>'dateTime' = 'NaT' THEN CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->>'birthDate')))END ELSE CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate'))) END END) AS age");
    });
});