import discreteCountCalculator from "../../../../src/domain/calculation/discrete/discreteCountCalculator";
import CategoricalMesure from "../../../../src/models/categoricalMeasure";
import queryDataResultsObjectMother from "../../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother"
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('discreteCountCalculator tests', () => {
    const field = fieldObjectMother.get('gender');
    const complexPathField = fieldObjectMother.get('path.complex');
    const fieldWithCaps = fieldObjectMother.get('path.Complex');
    const selector = selectorObjectMother.get('Patient', [field], []);
    const measure = CategoricalMesure.count;

    it('with one male, value is counted only once', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ gender: 'male', count: 1 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, field, measure, queryResult);

        // ACT
        const discreteCounts = discreteCountCalculator.calculate(selector, queryDataResults, field, measure);

        // ASSERT
        expect(discreteCounts.length).toEqual(1);
        expect(discreteCounts[0].label).toEqual('male')
        expect(discreteCounts[0].value).toEqual(1);
    })

    it('with three females, value is counted three times', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ gender: 'female', count: 3 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, field, measure, queryResult);

        // ACT
        const discreteCounts = discreteCountCalculator.calculate(selector, queryDataResults, field, measure);

        // ASSERT
        expect(discreteCounts.length).toEqual(1);
        expect(discreteCounts[0].label).toEqual('female')
        expect(discreteCounts[0].value).toEqual(3);
    })

    it('with mixed males and females, each label is counted for total gender counts', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ gender: 'female', count: 3 }, { gender: 'male', count: 2 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, field, measure, queryResult);

        // ACT
        const discreteCounts = discreteCountCalculator.calculate(selector, queryDataResults, field, measure);

        // ASSERT
        expect(discreteCounts.length).toEqual(2);

        expect(discreteCounts[0].label).toEqual('female')
        expect(discreteCounts[0].value).toEqual(3);

        expect(discreteCounts[1].label).toEqual('male')
        expect(discreteCounts[1].value).toEqual(2);
    })

    it('with complex field path, field path matches query field path with . replaced by _', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ path_complex: 'female', count: 3 }, { path_complex: 'male', count: 2 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, complexPathField, measure, queryResult);

        // ACT
        const discreteCounts = discreteCountCalculator.calculate(selector, queryDataResults, complexPathField, measure);

        // ASSERT
        expect(discreteCounts.length).toEqual(2);

        expect(discreteCounts[0].label).toEqual('female')
        expect(discreteCounts[0].value).toEqual(3);

        expect(discreteCounts[1].label).toEqual('male')
        expect(discreteCounts[1].value).toEqual(2);
    })

    it('with field with caps, field path matches query field path with caps removed', () => {
        // ARRANGE
        const queryResult = getQueryAndResult([{ path_complex: 'female', count: 3 }, { path_complex: 'male', count: 2 }]);

        const queryDataResults = queryDataResultsObjectMother.get();
        queryDataResults.addResult(selector, fieldWithCaps, measure, queryResult);

        // ACT
        const discreteCounts = discreteCountCalculator.calculate(selector, queryDataResults, fieldWithCaps, measure);

        // ASSERT
        expect(discreteCounts.length).toEqual(2);

        expect(discreteCounts[0].label).toEqual('female')
        expect(discreteCounts[0].value).toEqual(3);

        expect(discreteCounts[1].label).toEqual('male')
        expect(discreteCounts[1].value).toEqual(2);
    })

    function getQueryAndResult(result: any) {
        return {
            query: "SELECT * FROM Patient",
            result
        }
    }
})