import { when } from "jest-when";
import fieldMetricCalculatorsFactory from "../../../src/domain/calculation/fieldMetricCalculatorsFactory";
import fieldReponseProcessor from "../../../src/domain/calculation/fieldReponseProcessor";
import ContinuousMesure from "../../../src/models/continuousMeasure";
import FieldInfo from "../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../src/models/request/conditionOperator";
import Field from "../../../src/models/request/field";
import fieldMetricCalculatorObjectMother from "../../utils/objectMothers/domain/calculation/fieldMetricCalculatorObjectMother";
import queryDataResultsObjectMother from "../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldInfoObjectMother from "../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import measuresObjectMother from "../../utils/objectMothers/models/request/measuresObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";

describe('fieldReponseProcessor tests', () => {
    const tokenField = fieldInfoObjectMother.get('token');
    const countMetricCalculator = fieldMetricCalculatorObjectMother.get(ContinuousMesure.count, () => 72);

    it('gets field from aidbox data and metric calculators', () => {
        // ARRANGE
        const field = fieldObjectMother.get('field', 'field', 'string');
        const fieldsMap = getFieldsMap([field], [tokenField]);
        const selector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});

        const measures = measuresObjectMother.get();
        const queryDataResults = queryDataResultsObjectMother.get();

        // Following measure is not important as long a result for field exits.
        queryDataResults.addResult(selector, field, ContinuousMesure.count, { query: '', result: {} });

        fieldMetricCalculatorsFactory.get = jest.fn();
        when(fieldMetricCalculatorsFactory.get as any)
            .calledWith(field, measures, fieldsMap)
            .mockReturnValue([countMetricCalculator]);

        // ACT
        const fieldReponse = fieldReponseProcessor.getFieldReponse(selector, field, measures, queryDataResults, fieldsMap);

        // ASSERT
        expect(fieldReponse.field).toEqual(field.path);
        expect(fieldReponse.count).toEqual(72);
    });

    function getFieldsMap(fields: Field[], aidboxFields: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], aidboxFields[fieldIndex]);
        }

        return fieldsMap;
    }
});