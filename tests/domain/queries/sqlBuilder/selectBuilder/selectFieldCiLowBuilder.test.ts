import selectFieldCiLowBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectFieldCiLowBuilder";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import FieldInfo from "../../../../../src/models/fieldInfo";
import Field from "../../../../../src/models/request/field";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectFieldCiLowBuilder tests', () => {
    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    })
    const stringFieldInfo = fieldInfoObjectMother.get('string');
    const integerFieldInfo = fieldInfoObjectMother.get('integer');

    it('gets sum of json field as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('gender', 'gender', 'string');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], []);
        const fieldTypes = getFieldMap([field], [stringFieldInfo]);

        // ACT
        const result = selectFieldCiLowBuilder.build(field, fieldTypes, patientSelector);

        // ASSERT
        expect(result).toEqual("percentile_disc(0.05) within group (order by (resource->>'gender')::string) AS ci_low");
    })

    it('with array field, gets json field array formatted as field with fields path . replaced with _ and subquery name', () => {
        // ARRANGE
        const field = fieldObjectMother.get('address.country.name', 'country', 'string');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], []);
        const fieldTypes = getFieldMap([field], [stringFieldInfo]);

        resourceArrayFields.values = ['address.country'];

        // ACT
        const result = selectFieldCiLowBuilder.build(field, fieldTypes, patientSelector);

        // ASSERT
        expect(result).toEqual("percentile_disc(0.05) within group (order by (jsonb_array_elements(resource->'address'->'country')->>'name')::string) AS ci_low");
    })

    it('gets age field from calculated fields', () => {
        // ARRANGE
        const field = fieldObjectMother.get('age', 'age', 'integer');
        const patientSelector = selectorObjectMother.get('Patient', 'patient', [field], []);
        const fieldTypes = getFieldMap([field], [integerFieldInfo]);

        // ACT
        const result = selectFieldCiLowBuilder.build(field, fieldTypes, patientSelector);

        // ASSERT
        expect(result).toEqual("percentile_disc(0.05) within group (order by (CASE WHEN resource->'deceased'->>'dateTime' IS NULL OR resource->'deceased'->>'dateTime' = 'NaT' THEN CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->>'birthDate')))END ELSE CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate'))) END END)::integer) AS ci_low");
    })

    function getFieldMap(fields: Field[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
})