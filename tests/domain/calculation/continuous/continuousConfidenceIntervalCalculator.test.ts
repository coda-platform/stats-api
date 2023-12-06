import continuousConfidenceIntervalCalculator from "../../../../src/domain/calculation/continuous/continuousConfidenceIntervalCalculator";
import continuousMeanCalculator from "../../../../src/domain/calculation/continuous/continuousMeanCalculator";
import CategoricalMesure from "../../../../src/models/categoricalMeasure";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import queryDataResultsObjectMother from "../../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('continuousConfidenceIntervalCalculator tests', () => {
    const field = fieldObjectMother.get('gender', 'gender', 'string');
    const selector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});
    const measure = CategoricalMesure.count;

    it('with mean and sum, both results returned for mean', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ ci_low: 15, ci_high: 18 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, field, measure, queryResult);

        // ACT
        const meanResponse = continuousConfidenceIntervalCalculator.calculate(selector, queryDataResults, field, measure);

        // ASSERT
        expect(meanResponse).toEqual([15, 18]);
    });

    function getQueryAndResult(result: any) {
        return {
            query: "SELECT SUM(*) FROM Patient",
            result
        };
    }
});