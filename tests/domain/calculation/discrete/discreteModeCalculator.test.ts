import discreteModeCalculator from "../../../../src/domain/calculation/discrete/discreteModeCalculator";
import CategoricalMesure from "../../../../src/models/categoricalMeasure";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import queryDataResultsObjectMother from "../../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('discreteModeCalculator tests', () => {
    const field = fieldObjectMother.get('gender', 'gender', 'string');
    const complexPathField = fieldObjectMother.get('path.complex', 'label', 'type');
    const fieldWithCaps = fieldObjectMother.get('path.Complex', 'label', 'type');
    const selector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});
    const measure = CategoricalMesure.mode;


    it('with mixed males and females, label most present is mode', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ gender: 'female', count: 3 }, { gender: 'male', count: 2 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, field, measure, queryResult);

        // ACT
        const mode = discreteModeCalculator.calculate(selector, queryDataResults, field, measure);

        // ASSERT
        expect(mode).toEqual('female');
    });

    it('with complex field path, field path matches query field path with . replaced by _', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ path_complex: 'female', count: 3 }, { path_complex: 'male', count: 2 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, complexPathField, measure, queryResult);

        // ACT
        const mode = discreteModeCalculator.calculate(selector, queryDataResults, complexPathField, measure);

        // ASSERT
        expect(mode).toEqual('female');
    });

    it('with field with caps, field path matches query field path with caps removed', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ path_complex: 'female', count: 3 }, { path_complex: 'male', count: 2 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, fieldWithCaps, measure, queryResult);

        // ACT
        const mode = discreteModeCalculator.calculate(selector, queryDataResults, fieldWithCaps, measure);

        // ASSERT
        expect(mode).toEqual('female');
    });

    function getQueryAndResult(result: any) {
        return {
            query: "SELECT * FROM Patient",
            result
        };
    }
});