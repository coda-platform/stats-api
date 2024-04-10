import selectFieldTypesBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFieldTypesBuilder";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectFieldTypeBuilder tests', () => {
    it('outputs selector fields as formatedFieldPath', () => {
        // ARRANGE
        const genderField = fieldObjectMother.get('gender', 'gender', 'string');
        const ageField = fieldObjectMother.get('age', 'age', 'integer');

        const selector = selectorObjectMother.get('Patient', 'patient', [genderField, ageField], {conditionOperator:ConditionOperator.and, conditions:[]});

        // ACT
        const result = selectFieldTypesBuilder.build(selector);

        // ASSERT
        expect(result).toEqual("jsonb_typeof(resource->'gender') AS gender, pg_typeof(CASE WHEN resource->'deceased'->>'dateTime' IS NULL THEN CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->>'birthDate')))END ELSE CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate'))) END END) AS age");
    });
});