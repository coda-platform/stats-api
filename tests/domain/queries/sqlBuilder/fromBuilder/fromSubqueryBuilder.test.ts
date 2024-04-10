import fromSubqueryBuilder from "../../../../../src/domain/queries/sqlBuilder/fromBuilder/fromSubqueryBuilder";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import Field from "../../../../../src/models/request/field";
import FieldInfo from "../../../../../src/models/fieldInfo";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import Filter from "../../../../../src/models/request/filter";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import { when } from "jest-when";

describe('fromSubqueryBuilder tests', () => {
    const genderField = fieldObjectMother.get('gender', 'gender', 'string');
    const cityAddressField = fieldObjectMother.get('address.city', 'city', 'string');

    const quebecCityFilter = filterObjectMother.get('address.city', 'is', 'Quebec', 'string');
    const maleGenderFilter = filterObjectMother.get('gender', 'is', 'male', 'string');
    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');

    const fieldAFilter = filterObjectMother.get('fieldA', 'is', 'valueA', 'type');
    const fieldBFilter = filterObjectMother.get('fieldB', 'is', 'valueB', 'type');

    const stringFieldInfo = fieldInfoObjectMother.get('string');
    //const genderFieldMap = getFieldsMap([genderField], [stringFieldInfo]);
    //const cityFieldMap = getFieldsMap([cityAddressField], [stringFieldInfo]);
    //const filtersMap = getFiltersMap([fieldAFilter], [stringFieldInfo]);

    beforeEach(() => {
        resourceArrayFields.get = jest.fn();
        when(resourceArrayFields.get as any)
            .mockReturnValue([]);
    });

    it('with field, no filter, no array field is selected with good nomenclature', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [genderField], {conditionOperator:ConditionOperator.and, conditions:[]});
        const genderFieldMap = getFieldsMap([genderField], [stringFieldInfo]);
        const filtersMap = getFiltersMap([], []);

        // ACT
        const result = fromSubqueryBuilder.build(selector, filtersMap, genderFieldMap);

        // ASSERT
        expect(result).toEqual("(SELECT (resource->>'gender')::string AS gender FROM Patient patient_table ) as subQuery");
    });

    it('with array field, no filter, field is unrolled and selected with good nomenclature', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [cityAddressField], {conditionOperator:ConditionOperator.and, conditions:[]});
        const cityFieldMap = getFieldsMap([cityAddressField], [stringFieldInfo]);
        const filtersMap = getFiltersMap([], []);

        when(resourceArrayFields.get as any)
            .calledWith(selector)
            .mockReturnValue(['address']);

        // ACT
        const result = fromSubqueryBuilder.build(selector, filtersMap, cityFieldMap);

        // ASSERT
        expect(result).toEqual("(SELECT (jsonb_array_elements(resource->'address')->>'city')::string AS city FROM Patient patient_table ) as subQuery");
    });

    it('with array field and filter, field and filter are unrolled and selected with good nomenclature', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [genderField], {conditionOperator:ConditionOperator.and, conditions:[quebecCityFilter]});
        const genderFieldMap = getFieldsMap([genderField], [stringFieldInfo]);
        const filtersMap = getFiltersMap([quebecCityFilter], [stringFieldInfo]);

        when(resourceArrayFields.get as any)
            .calledWith(selector)
            .mockReturnValue(['address']);

        // ACT
        const result = fromSubqueryBuilder.build(selector, filtersMap, genderFieldMap);

        // ASSERT
        expect(result).toEqual("(SELECT (resource->>'gender')::string AS gender FROM Patient patient_table  WHERE patient_table.resource->'address' @> '[{\"city\":\"Quebec\"}]') as subQuery");
    });

    it('with field and two filters, field and filters are selected with good nomenclature', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [genderField], {conditionOperator:ConditionOperator.and, conditions:[fieldAFilter, fieldBFilter]});
        const filtersMap = getFiltersMap([fieldAFilter, fieldBFilter], [stringFieldInfo, stringFieldInfo]);
        const genderFieldMap = getFieldsMap([genderField], [stringFieldInfo]);

        // ACT
        const result = fromSubqueryBuilder.build(selector, filtersMap, genderFieldMap);

        // ASSERT
        expect(result).toEqual("(SELECT (resource->>'gender')::string AS gender FROM Patient patient_table  WHERE (resource->>'fieldA')::string = 'valueA' AND (resource->>'fieldB')::string = 'valueB') as subQuery");
    });

    it('with field and filter, both same field, field is only once in subquery', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [genderField], {conditionOperator:ConditionOperator.and, conditions:[maleGenderFilter]});
        const genderFieldMap = getFieldsMap([genderField], [stringFieldInfo]);
        const filtersMap = getFiltersMap([maleGenderFilter], [stringFieldInfo]);

        // ACT
        const result = fromSubqueryBuilder.build(selector, filtersMap, genderFieldMap);

        // ASSERT
        expect(result).toEqual("(SELECT (resource->>'gender')::string AS gender FROM Patient patient_table  WHERE (resource->>'gender')::string = 'male') as subQuery");
    });

    it('with city field, two filters same field, filter field is only included once', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [cityAddressField], {conditionOperator:ConditionOperator.and, conditions:[maleGenderFilter, femaleGenderFilter]});
        const cityFieldMap = getFieldsMap([cityAddressField], [stringFieldInfo]);
        const filtersMap = getFiltersMap([maleGenderFilter, femaleGenderFilter], [stringFieldInfo, stringFieldInfo]);

        // ACT
        const result = fromSubqueryBuilder.build(selector, filtersMap, cityFieldMap);

        // ASSERT
        expect(result).toEqual("(SELECT (resource->'address'->>'city')::string AS city FROM Patient patient_table  WHERE (resource->>'gender')::string = 'male' AND (resource->>'gender')::string = 'female') as subQuery");
    });

    function getFieldsMap(fields: Field[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }

    function getFiltersMap(filters: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < filters.length; fieldIndex++) {
            fieldsMap.set(filters[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
});