import FieldInfo from "../../../../../src/models/fieldInfo";
import Filter from "../../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import continuousQuery from "../../../../../src/domain/queries/calculation/continuous/continuousQuery";
import Field from "../../../../../src/models/request/field";
import ContinuousMesure from "../../../../../src/models/continuousMeasure";
import CategoricalMesure from "../../../../../src/models/categoricalMeasure";
import Measures from "../../../../../src/models/request/measures";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import { when } from "jest-when";

describe('continuousTotalQuery tests', () => {
    const ageField = fieldObjectMother.get('age', 'age', 'integer');
    const genderField = fieldObjectMother.get('gender', 'gender', 'string');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const stringFieldInfo = fieldInfoObjectMother.get('string');
    const integerFieldInfo = fieldInfoObjectMother.get('integer');

    const filterMaps = getFiltersMap([femaleGenderFilter], [stringFieldInfo]);
    const measures:Measures = {
        "continuous":[ContinuousMesure.count],
        "categorical":[]
    };

    beforeEach(() => {
        resourceArrayFields.get = jest.fn();
        when(resourceArrayFields.get as any)
            .mockReturnValue([]);
    });

    it('With field and no filter, groups by field', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [genderField], {conditionOperator:ConditionOperator.and, conditions:[]});
        const fieldTypes = getFieldsMap([genderField], [stringFieldInfo]);

        // ACT
        const query = continuousQuery.getQuery(selector, genderField, filterMaps, fieldTypes, measures);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .fieldSum(genderField, fieldTypes, selector)
            .from()
            .resourceTable()
            .possibleJoin(fieldTypes)
            .build(selector, filterMaps));
    });

    it('With age computed field and no filter, groups by field with WHERE filter', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [ageField], {conditionOperator:ConditionOperator.and, conditions:[]});
        const fieldTypes = getFieldsMap([ageField], [integerFieldInfo]);

        // ACT
        const query = continuousQuery.getQuery(selector, ageField, filterMaps, fieldTypes, measures);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .fieldSum(ageField, fieldTypes, selector)
            .from()
            .resourceTable()
            .possibleJoin(fieldTypes)
            .build(selector, filterMaps));
    });

    it('With field and filter, groups by field with WHERE filter', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [genderField], {conditionOperator:ConditionOperator.and, conditions:[femaleGenderFilter]});
        const fieldTypes = getFieldsMap([genderField], [stringFieldInfo]);

        // ACT
        const query = continuousQuery.getQuery(selector, genderField, filterMaps, fieldTypes, measures);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .fieldSum(genderField, fieldTypes, selector)
            .from()
            .resourceTable()
            .possibleJoin(fieldTypes)
            .where()
            .fieldFilter()
            .build(selector, filterMaps));
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