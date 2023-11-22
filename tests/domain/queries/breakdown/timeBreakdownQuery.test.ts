import timeBreakdownQuery from "../../../../src/domain/queries/breakdown/timeBreakdownQuery";
import countResourceQuery from "../../../../src/domain/queries/countResourceQuery";
import fieldLabelFormatter from "../../../../src/domain/queries/fieldLabelFormatter";
import resourceArrayFields from "../../../../src/domain/resourceArrayFields";
import FieldInfo from "../../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import Field from "../../../../src/models/request/field";
import Filter from "../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../utils/objectMothers/models/filterObjectMother";
import breakdownObjectMother from "../../../utils/objectMothers/models/request/breakdownObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";
import { describe, expect, it, beforeEach } from "@jest/globals";

describe('timeBreakdownQuery tests', () => {

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const stringFieldInfo = fieldInfoObjectMother.get('string');
    const dateTimeFieldInfo = fieldInfoObjectMother.get('dateTime');
    const deceasedDateField = fieldObjectMother.get('deceased.dateTime', 'deceasedDate', 'dateTime');
    const deceasedDateBreakdown = breakdownObjectMother.get('Patient', 'deceased.dateTime', 60, 'dateTime');

    const filterMaps = getFiltersMap([femaleGenderFilter], [stringFieldInfo]);

    const fieldMap = getFieldsMap([deceasedDateField], [dateTimeFieldInfo]);

    beforeEach(() => {
        resourceArrayFields.values = [];

    });


    it('gets query with resource from', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [deceasedDateField], { conditionOperator: ConditionOperator.and, conditions: [] }, undefined);

        // ACT
        const query = timeBreakdownQuery.getQuery(selector, filterMaps, fieldMap, deceasedDateBreakdown);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .breakdownPeriodStart(deceasedDateBreakdown.slices.step, fieldLabelFormatter.formatLabel(deceasedDateField.label))
            .comma()
            .namedCountAll('count_in_period')
            .from()
            .subquery(fieldMap)
            .groupBy()
            .compiledField('period_start')
            .build(selector, filterMaps));
    });

    it('gets query with filters applied', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [deceasedDateField], { conditionOperator: ConditionOperator.and, conditions: [femaleGenderFilter] }, undefined);

        // ACT
        const query = timeBreakdownQuery.getQuery(selector, filterMaps, fieldMap, deceasedDateBreakdown);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .breakdownPeriodStart(deceasedDateBreakdown.slices.step, fieldLabelFormatter.formatLabel(deceasedDateField.label))
            .comma()
            .namedCountAll('count_in_period')
            .from()
            .subquery(fieldMap)
            .groupBy()
            .compiledField('period_start')
            .build(selector, filterMaps));
    });

    it('gets query with cross join and filters applied when one field is array type', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [deceasedDateField], { conditionOperator: ConditionOperator.and, conditions: [femaleGenderFilter] });

        resourceArrayFields.values = ['gender'];

        // ACT
        const query = timeBreakdownQuery.getQuery(selector, filterMaps, fieldMap, deceasedDateBreakdown);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .breakdownPeriodStart(deceasedDateBreakdown.slices.step, fieldLabelFormatter.formatLabel(deceasedDateField.label))
            .comma()
            .namedCountAll('count_in_period')
            .from()
            .subquery(fieldMap)
            .groupBy()
            .compiledField('period_start')
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