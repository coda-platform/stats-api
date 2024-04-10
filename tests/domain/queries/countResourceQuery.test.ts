import countResourceQuery from "../../../src/domain/queries/countResourceQuery";
import FieldInfo from "../../../src/models/fieldInfo";
import Filter from "../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../utils/objectMothers/models/fieldInfoObjectMother";
import filterObjectMother from "../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../src/domain/resourceArrayFields";
import Field from "../../../src/models/request/field";
import { ConditionOperator } from "../../../src/models/request/conditionOperator";
import { when } from "jest-when";

describe('countResourceQuery tests', () => {

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const joinSelector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});

    const filterMaps = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);

    const fieldMap = new Map<Field, FieldInfo>();


    it('gets query with resource from', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]}, joinSelector);

        // ACT
        const query = countResourceQuery.getQuery(selector, filterMaps, fieldMap);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .countAll()
            .from()
            .resourceTable()
            .possibleJoin(fieldMap)
            .build(selector, filterMaps));
    });

    it('gets query with filters applied', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[femaleGenderFilter]}, joinSelector);

        // ACT
        const query = countResourceQuery.getQuery(selector, filterMaps, fieldMap);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .countAll()
            .from()
            .resourceTable()
            .possibleJoin(fieldMap)
            .where()
            .fieldFilter()
            .build(selector, filterMaps));
    });

    it('escapes resource to avoid sql injections', () => {
        // ARRANGE
        const selector = selectorObjectMother.get("Patient'--drop", 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});

        // ACT
        const query = countResourceQuery.getQuery(selector, filterMaps, fieldMap);

        // ASSERT
        expect(query).toEqual("SELECT count(*) FROM Patient patient_table "); // Space is added by possible join which has no impact
    });

    it('gets query with cross join and filters applied when one field is array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[femaleGenderFilter]}, joinSelector);

        resourceArrayFields.get = jest.fn();
        when(resourceArrayFields.get as any)
            .calledWith(selector)
            .mockReturnValue(['gender']);

        // ACT
        const query = countResourceQuery.getQuery(selector, filterMaps, fieldMap);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .countAll()
            .from()
            .resourceTable()
            .possibleJoin(fieldMap)
            .where()
            .fieldFilter()
            .build(selector, filterMaps));
    });

    function getFieldsMap(filters: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < filters.length; fieldIndex++) {
            fieldsMap.set(filters[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
});