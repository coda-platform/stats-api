import FieldReponseBuilder from "../../../src/domain/calculation/fieldReponseBuilder";
import ContinuousMesure from "../../../src/models/continuousMeasure";
import FieldInfo from "../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../src/models/request/conditionOperator";
import Field from "../../../src/models/request/field";
import fieldMetricCalculatorObjectMother from "../../utils/objectMothers/domain/calculation/fieldMetricCalculatorObjectMother";
import queryDataResultsObjectMother from "../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";

describe('fieldReponseBuilder tests', () => {
    const countMetricCalculator = fieldMetricCalculatorObjectMother.get(ContinuousMesure.count, () => 72);
    const meanMetricCalculator = fieldMetricCalculatorObjectMother.get(ContinuousMesure.mean, () => 45);

    const queryDataResults = queryDataResultsObjectMother.get();

    describe('build', () => {
        it('sets field name and calculation results', () => {
            // ARRANGE
            const field = fieldObjectMother.get('field', 'field', 'string');
            const selector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});
            const fieldReponseBuilder = new FieldReponseBuilder(field, [countMetricCalculator, meanMetricCalculator]);
            const fieldTypes = new Map<Field, FieldInfo>();

            const sqlQueryA = "SELECT * FROM Patient";
            queryDataResults.addResult(selector, field, ContinuousMesure.count, { query: sqlQueryA, result: {} });

            // ACT
            const fieldReponse = fieldReponseBuilder.build(selector, queryDataResults, fieldTypes);

            // ASSERT
            expect(fieldReponse.field).toEqual(field.path);
            expect(fieldReponse.count).toEqual(72);
            expect(fieldReponse.mean).toEqual(45);
        });

        it('sets the used query to get the measures.', () => {
            // ARRANGE
            const field = fieldObjectMother.get('field', 'field', 'string');
            const selector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});
            const fieldReponseBuilder = new FieldReponseBuilder(field, [countMetricCalculator, meanMetricCalculator]);
            const fieldTypes = new Map<Field, FieldInfo>();

            const sqlQueryA = "SELECT * FROM Patient";
            queryDataResults.addResult(selector, field, ContinuousMesure.count, { query: sqlQueryA, result: {} });

            const sqlQueryB = "SELECT * FROM Observation";
            queryDataResults.addResult(selector, field, ContinuousMesure.mean, { query: sqlQueryB, result: {} });

            // ACT
            const fieldReponse = fieldReponseBuilder.build(selector, queryDataResults, fieldTypes);

            // ASSERT
            expect(fieldReponse.queries.length).toEqual(2);
            expect(fieldReponse.queries[0]).toBe(sqlQueryA);
            expect(fieldReponse.queries[1]).toBe(sqlQueryB);
        });
    });
});