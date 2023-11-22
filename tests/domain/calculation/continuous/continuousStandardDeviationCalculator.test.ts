import continuousStandardDeviationCalculator from "../../../../src/domain/calculation/continuous/continuousStandardDeviationCalculator";
import CategoricalMesure from "../../../../src/models/categoricalMeasure";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import queryDataResultsObjectMother from "../../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('continuousStandardDeviationCalculator tests', () => {
    const field = fieldObjectMother.get('gender', 'gender', 'string');
    const selector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});
    const measure = CategoricalMesure.count;

    it('with sum in query, sum is returned.', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ stddev: 23.4 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, field, measure, queryResult);

        // ACT
        const stddev = continuousStandardDeviationCalculator.calculate(selector, queryDataResults, field, measure);

        // ASSERT
        expect(stddev).toEqual(23.4);
    });

    function getQueryAndResult(result: any) {
        return {
            query: "SELECT SUM(*) FROM Patient",
            result
        };
    }
});