import { when } from "jest-when";
import timeBreakdownQuery from "../../../src/domain/queries/breakdown/timeBreakdownQuery";
import countResourceQuery from "../../../src/domain/queries/countResourceQuery";
import aidboxProxy from "../../../src/infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../src/models/request/conditionOperator";
import Field from "../../../src/models/request/field";
import Filter from "../../../src/models/request/filter";
import breakdownDataQueryExecutor from "../../../src/repositories/data/breakdownDataQueryExecutor";
import fieldsMeasureDataQueryExecutor from "../../../src/repositories/data/fieldsMeasureDataQueryExecutor";
import selectorsDataQueryExecutor from "../../../src/repositories/data/selectorsDataQueryExecutor";
import queryDataResultsObjectMother from "../../utils/objectMothers/domain/queryDataResultsObjectMother";
import aidboxFieldResponseObjectMother from "../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import breakdownObjectMother from "../../utils/objectMothers/models/request/breakdownObjectMother";
import measuresObjectMother from "../../utils/objectMothers/models/request/measuresObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";
import ConditionObjectMother from "../../utils/objectMothers/models/ConditionObjectMother";

describe('selectorsDataQueryExecutor tests', () => {
    const measures = measuresObjectMother.getAllOptionMeasures();
    let fieldMaps = new Map<Field, FieldInfo>();
    const filterMaps = new Map<Filter, FieldInfo>();
    const birthdateField = fieldObjectMother.get('birthDate', 'birthDate', 'dateTime');
    const dateTimeFieldType = aidboxFieldResponseObjectMother.get('dateTime');

    const emptyCondition = ConditionObjectMother.get(ConditionOperator.and, []);

    const countQuery = "SELECT count(*) from Patient";
    const countResult = { count: 45 };

    const breakdownQuery = "SELECT count(*) AS count_breakdown from Patient";
    const breakdownResult = { count: 54 };

    const textFieldType = aidboxFieldResponseObjectMother.get('string');

    beforeEach(() => {
        fieldsMeasureDataQueryExecutor.executeQuery = jest.fn();
        aidboxProxy.executeQuery = jest.fn();
        countResourceQuery.getQuery = jest.fn();
        timeBreakdownQuery.getQuery = jest.fn();
    });

    it('gets the total count for resource', async () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], emptyCondition);

        when(countResourceQuery.getQuery as any)
            .calledWith(selector, filterMaps, fieldMaps)
            .mockReturnValue(countQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(countQuery)
            .mockReturnValue([countResult]); // Array important because sql results yield row returns.

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, fieldMaps, filterMaps);

        // ASSERT
        const totalResult = queryDataResults.getSelectorResult(selector);
        expect(totalResult).toEqual({ query: countQuery, result: countResult });
    });

    it('with breakdown, gets the breakdown for resource', async () => {
        // ARRANGE
        const breakdown = breakdownObjectMother.get('Patient', 'deceasedTime', 60, 'dateTime');
        const selector = selectorObjectMother.get('Patient', 'patient', [birthdateField], emptyCondition, undefined);
        const fieldsMap = getFieldsMap([birthdateField], [dateTimeFieldType]);

        when(countResourceQuery.getQuery as any)
            .calledWith(selector, filterMaps, fieldsMap)
            .mockReturnValue(countQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(countQuery)
            .mockReturnValue([countResult]); // Array important because sql results yield row returns.

        when(timeBreakdownQuery.getQuery as any)
            .calledWith(selector, filterMaps, fieldsMap, breakdown)
            .mockReturnValue(breakdownQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(breakdownQuery)
            .mockReturnValue([breakdownResult]); // Array important because sql results yield row returns.

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, fieldsMap, filterMaps);
        await breakdownDataQueryExecutor.executeBreakdownQuery(queryDataResults, selector, fieldsMap, filterMaps, breakdown);

        // ASSERT
        const selectorBreakdownResult = queryDataResults.getSelectorBreakdownResult(selector);
        expect(selectorBreakdownResult).toEqual({ query: breakdownQuery, result: [breakdownResult] });
    });

    it('with breakdown, breakdown has its own query, gets the breakdown from query', async () => {
        // ARRANGE
        const breakdown = breakdownObjectMother.get('Patient', 'deceasedTime', 60, 'dateTime', breakdownQuery);
        const selector = selectorObjectMother.get('Patient', 'patient', [], emptyCondition, undefined);

        when(countResourceQuery.getQuery as any)
            .calledWith(selector, filterMaps, fieldMaps)
            .mockReturnValue(countQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(countQuery)
            .mockReturnValue([countResult]); // Array important because sql results yield row returns.

        when(aidboxProxy.executeQuery as any)
            .calledWith(breakdownQuery)
            .mockReturnValue([breakdownResult]); // Array important because sql results yield row returns.

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, fieldMaps, filterMaps);
        await breakdownDataQueryExecutor.executeBreakdownQuery(queryDataResults, selector, fieldMaps, filterMaps, breakdown);

        // ASSERT
        const selectorBreakdownResult = queryDataResults.getSelectorBreakdownResult(selector);
        expect(selectorBreakdownResult).toEqual({ query: breakdownQuery, result: [breakdownResult] });
    });

    it('with two fields in selector, field queries are executed', async () => {
        // ARRANGE
        const fieldA = fieldObjectMother.get('fieldA', 'labelA', 'string');
        const fieldB = fieldObjectMother.get('fieldB', 'labelB', 'string');

        const selector = selectorObjectMother.get('Patient', 'patient', [fieldA, fieldB], emptyCondition);
        fieldMaps = getFieldsMap([fieldA, fieldB], [textFieldType, textFieldType]);

        when(countResourceQuery.getQuery as any)
            .calledWith(selector, filterMaps, fieldMaps)
            .mockReturnValue(countQuery);

        when(aidboxProxy.executeQuery as any)
            .calledWith(countQuery)
            .mockReturnValue([countResult]); // Array important because sql results yield row returns.

        const queryDataResults = queryDataResultsObjectMother.get();

        // ACT
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, fieldMaps, filterMaps);

        // ASSERT
        expect(fieldsMeasureDataQueryExecutor.executeQuery).toBeCalledWith(queryDataResults, fieldA, measures, fieldMaps, filterMaps, selector);
        expect(fieldsMeasureDataQueryExecutor.executeQuery).toBeCalledWith(queryDataResults, fieldB, measures, fieldMaps, filterMaps, selector);
    });

    function getFieldsMap(fields: Field[], aidboxFields: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], aidboxFields[fieldIndex]);
        }

        return fieldsMap;
    }
});