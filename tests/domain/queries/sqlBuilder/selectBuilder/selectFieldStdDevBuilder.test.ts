import selectFieldStddevBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFieldStdDevBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import FieldInfo from "../../../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import Field from "../../../../../src/models/request/field";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectFieldStdDevBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    });

    it('gets sum of json field as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country', 'string');
        const fieldTypes = new Map<Field, FieldInfo>();
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});

        // ACT
        const result = selectFieldStddevBuilder.build(field, fieldTypes, patientSelector);

        // ASSERT
        expect(result).toEqual("STDDEV(resource->'address'->'country'->>'name') AS stddev");
    });

    it('with array field, gets json field array formatted as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country', 'string');
        const fieldTypes = new Map<Field, FieldInfo>();
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});

        resourceArrayFields.values = ['address.country'];

        // ACT
        const result = selectFieldStddevBuilder.build(field, fieldTypes, patientSelector);

        // ASSERT
        expect(result).toEqual("STDDEV(jsonb_array_elements(resource->'address'->'country')->>'name') AS stddev");
    });

    it('gets age field from calculated fields', () => {
        // ARRANGE
        const field = fieldObjectMother.get('age', 'age', 'integer');
        const fieldTypes = new Map<Field, FieldInfo>();
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});

        // ACT
        const result = selectFieldStddevBuilder.build(field, fieldTypes, patientSelector);

        // ASSERT
        expect(result).toEqual("STDDEV(CASE WHEN resource->'deceased'->>'dateTime' IS NULL OR resource->'deceased'->>'dateTime' = 'NaT' THEN CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->>'birthDate')))END ELSE CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate'))) END END) AS stddev");
    });
});