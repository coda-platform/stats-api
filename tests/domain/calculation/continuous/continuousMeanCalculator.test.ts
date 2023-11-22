import continuousMeanCalculator from "../../../../src/domain/calculation/continuous/continuousMeanCalculator";
import CategoricalMesure from "../../../../src/models/categoricalMeasure";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import queryDataResultsObjectMother from "../../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('continuousMeanCalculator tests', () => {
    const field = fieldObjectMother.get('gender', 'gender', 'string');
    const selector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});
    const measure = CategoricalMesure.count;

    it('with mean and sum, both results returned for mean', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ count: 544, mean: 45 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, field, measure, queryResult);

        // ACT
        const meanResponse = continuousMeanCalculator.calculate(selector, queryDataResults, field, measure);

        // ASSERT
        expect(meanResponse).toEqual({
            mean: 45,
            populationSize: 544
        });
    });

    function getQueryAndResult(result: any) {
        return {
            query: "SELECT SUM(*) FROM Patient",
            result
        };
    }
});