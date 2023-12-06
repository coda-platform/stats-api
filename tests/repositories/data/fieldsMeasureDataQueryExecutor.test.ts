import { when } from "jest-when";
import groupCountQuery from "../../../src/domain/queries/calculation/discrete/groupCountQuery";
import aidboxProxy from "../../../src/infrastructure/aidbox/aidboxProxy";
import CategoricalMesure from "../../../src/models/categoricalMeasure";
import queryDataResultsObjectMother from "../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";
import fieldsMeasureDataQueryExecutor from "../../../src/repositories/data/fieldsMeasureDataQueryExecutor";
import ContinuousMesure from "../../../src/models/continuousMeasure";
import continuousQuery from "../../../src/domain/queries/calculation/continuous/continuousQuery";
import fieldInfoObjectMother from "../../utils/objectMothers/models/fieldInfoObjectMother";
import Field from "../../../src/models/request/field";
import FieldInfo from "../../../src/models/fieldInfo";
import Filter from "../../../src/models/request/filter";
import Measures from "../../../src/models/request/measures";
import constants from "../../../src/constants";
import { ConditionOperator } from "../../../src/models/request/conditionOperator";

describe('fieldsMeasureDataQueryExecutor tests', () => {
    const field = fieldObjectMother.get('field', 'label', 'type');
    const selector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});

    const sqlQuery = "SELECT * FROM Patient";
    const result = { result: 'value' };
    const continuousResult = [{ sum: 'value'}];

    const testParameters = [
        {fieldType: 'float', query: continuousQuery, type: 'integer', result: continuousResult },
        {fieldType: 'text', query: groupCountQuery, type: 'string', result: result },
    ];

    const measures:Measures = {
        "continuous":[ContinuousMesure.count, ContinuousMesure.mean, ContinuousMesure.stdev, ContinuousMesure.ci95],
        "categorical":[CategoricalMesure.count, CategoricalMesure.mode, CategoricalMesure.marginals]
    };

    testParameters.forEach(tp => {
        it(`executes corresponding sql request for ${tp.fieldType} measure`, async () => {
            // ARRANGE
            const fieldType = tp.fieldType;

            const queryDataResults = queryDataResultsObjectMother.get();

            const fieldInfo = fieldInfoObjectMother.get(tp.type);

            const fieldsMap = getFieldsMap([field], [fieldInfo]);
            const filterMaps = new Map<Filter, FieldInfo>();
            const isContinousMeasure = constants.numericalTypes.some(nt => nt === fieldType);

            tp.query.getQuery = jest.fn();
            when(tp.query.getQuery as any)
                .calledWith(selector, field, filterMaps, fieldsMap, measures)
                .mockReturnValue(sqlQuery);

            aidboxProxy.executeQuery = jest.fn();
            when(aidboxProxy.executeQuery as any)
                .calledWith(sqlQuery)
                .mockReturnValue(tp.result);

            // ACT
            await fieldsMeasureDataQueryExecutor.executeQuery(queryDataResults, field, measures, fieldsMap,
                filterMaps, selector);

            // ASSERT
            const gottenResult = isContinousMeasure ?
             queryDataResults.getResult(selector, field, measures.continuous[0])
            : queryDataResults.getResult(selector, field, measures.categorical[0]);
            expect(gottenResult).toEqual({query: sqlQuery, result: tp.result});
        });
    });

    function getFieldsMap(fields: Field[], fieldInfos: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfos[fieldIndex]);
        }

        return fieldsMap;
    }
});