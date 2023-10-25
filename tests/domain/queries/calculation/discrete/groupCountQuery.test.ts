import groupCountQuery from "../../../../../src/domain/queries/calculation/discrete/groupCountQuery";
import FieldInfo from "../../../../../src/models/fieldInfo";
import Filter from "../../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import Field from "../../../../../src/models/request/field";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";

describe('groupCountQuery tests', () => {
    const genderField = fieldObjectMother.get('gender', 'gender', 'string');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const filterMaps = getFiltersMap([femaleGenderFilter], [stringFieldInfo]);
    const fieldMaps = getFieldsMap([genderField], [stringFieldInfo]);

    beforeEach(() => {
        resourceArrayFields.values = []; // Simplify tests by not unwrapping json arrays.
    })

    it('With field and no filter, groups by field', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [genderField], {conditionOperator:ConditionOperator.and, conditions:[]});

        // ACT
        const query = groupCountQuery.getQuery(selector, genderField, filterMaps, fieldMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .field(genderField)
            .comma()
            .countField(genderField, selector)
            .from()
            .resourceTable()
            .crossJoinForArrayFilters(genderField)
            .possibleJoin(fieldMaps)
            .groupBy()
            .field(genderField)
            .build(selector, filterMaps))
    })

    it('With field and filter, groups by field with WHERE filter', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [genderField], {conditionOperator:ConditionOperator.and, conditions:[femaleGenderFilter]});

        // ACT
        const query = groupCountQuery.getQuery(selector, genderField, filterMaps, fieldMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .field(genderField)
            .comma()
            .countField(genderField, selector)
            .from()
            .resourceTable()
            .crossJoinForArrayFilters(genderField)
            .possibleJoin(fieldMaps)
            .where()
            .fieldFilter()
            .groupBy()
            .field(genderField)
            .build(selector, filterMaps))
    })

    function getFieldsMap(fields: Field[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }

    function getFiltersMap(filters: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < filters.length; fieldIndex++) {
            fieldsMap.set(filters[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
})