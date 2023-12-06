import joinInnerQueryBuilder from "../../../../../../src/domain/queries/sqlBuilder/fromBuilder/join/joinInnerQueryBuilder";
import resourceArrayFields from "../../../../../../src/domain/resourceArrayFields";
import FieldInfo from "../../../../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../../../../src/models/request/conditionOperator";
import Field from "../../../../../../src/models/request/field";
import Filter from "../../../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../../utils/objectMothers/models/fieldInfoObjectMother";
import filterObjectMother from "../../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../../utils/objectMothers/models/selectorObjectMother";

describe('joinInnerBuilder tests', () => {
    const parentSelector = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]});
    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const filterMaps = getFiltersMap([femaleGenderFilter], [stringFieldInfo]);
    const fieldMaps = getFieldsMap([], []);


    it('gets query with resource from', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});
        parentSelector.joins = selector;

        // ACT
        const query = joinInnerQueryBuilder.build(parentSelector, filterMaps, fieldMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .joinId()
            .from()
            .resourceTable()
            .possibleJoin(fieldMaps)
            .build(parentSelector, filterMaps));
    });

    it('gets query with resource from with inner join', () => {
        // ARRANGE
        const joinSelector = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]});
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]}, joinSelector);

        // ACT
        const query = joinInnerQueryBuilder.build(selector, filterMaps, fieldMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .joinId()
            .from()
            .resourceTable()
            .possibleJoin(fieldMaps)
            .build(selector, filterMaps));
    });

    it('gets query with filters applied', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[femaleGenderFilter]});
        parentSelector.joins = selector;

        // ACT
        const query = joinInnerQueryBuilder.build(parentSelector, filterMaps, fieldMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .joinId()
            .from()
            .resourceTable()
            .possibleJoin(fieldMaps)
            .build(parentSelector, filterMaps));
    });

    it('escapes resource to avoid sql injections', () => {
        // ARRANGE
        const selector = selectorObjectMother.get("Patient'--drop", 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});

        // ACT
        const query = joinInnerQueryBuilder.build(selector, filterMaps, fieldMaps);

        // ASSERT
        expect(query).toEqual("SELECT id FROM Patient patient_table "); // Space is for potential inner join
    });

    it('gets query with cross join and filters applied when one field is array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[femaleGenderFilter]});
        parentSelector.joins = selector;

        resourceArrayFields.values = ['gender'];

        // ACT
        const query = joinInnerQueryBuilder.build(parentSelector, filterMaps, fieldMaps);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .joinId()
            .from()
            .resourceTable()
            .possibleJoin(fieldMaps)
            .build(parentSelector, filterMaps));
    });

    function getFiltersMap(filters: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < filters.length; fieldIndex++) {
            fieldsMap.set(filters[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
    function getFieldsMap(fields: Field[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
});