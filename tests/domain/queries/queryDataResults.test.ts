import QueryDataResults from "../../../src/domain/queries/queryDataResults";
import CategoricalMesure from "../../../src/models/categoricalMeasure";
import ContinuousMesure from "../../../src/models/continuousMeasure"
import { ConditionOperator } from "../../../src/models/request/conditionOperator";
import queryDataResultsObjectMother from "../../utils/objectMothers/domain/queryDataResultsObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";

describe('queryDataResults tests', () => {
    const continuousMeasureA = ContinuousMesure.ci95;
    const continuousMeasureB = ContinuousMesure.count;

    const categoricalMeasureA = CategoricalMesure.mode;
    const categoricalMeasureB = CategoricalMesure.count;

    const fieldA = fieldObjectMother.get('fieldA', 'label', 'string');
    const fieldB = fieldObjectMother.get('fieldB', 'label', 'string');

    const selectorA = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});
    const selectorB = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]});

    const resultA = { query: 'SELECT * FROM Patient', result: 'A' };
    const resultB = { query: 'SELECT * FROM Observation', result: 'B' };

    let queryDataResults: QueryDataResults;

    beforeEach(() => {
        queryDataResults = queryDataResultsObjectMother.get();
    })

    describe('selector results portion', () => {
        it('when result is not present for selector, an error is thrown', () => {
            expect(() => queryDataResults.getSelectorResult(selectorA)).toThrowError();
        })

        it('gets the correct result for selector', () => {
            // ARRANGE
            queryDataResults.addSelectorResult(selectorA, resultA);
            queryDataResults.addSelectorResult(selectorB, resultB);

            // ACT
            const result = queryDataResults.getSelectorResult(selectorB);

            // ASSERT
            expect(result).toBe(resultB);
        })
    })

    describe('breakdown selector results portion', () => {
        it('when result is not present for selector, an error is thrown', () => {
            expect(() => queryDataResults.getSelectorBreakdownResult(selectorA)).toThrowError();
        })

        it('gets the correct result for selector breakdown', () => {
            // ARRANGE
            queryDataResults.addSelectorBreakdownResult(selectorA, resultA);
            queryDataResults.addSelectorBreakdownResult(selectorB, resultB);

            // ACT
            const result = queryDataResults.getSelectorBreakdownResult(selectorB);

            // ASSERT
            expect(result).toBe(resultB);
        })
    })

    describe('results portion', () => {
        it('when result is not present, an error is thrown', () => {
            expect(() => queryDataResults.getResult(selectorA, fieldA, categoricalMeasureB)).toThrowError();
        })

        it('gets the correct result for metric from multiple continuous measures', () => {
            // ARRANGE
            queryDataResults.addResult(selectorA, fieldA, continuousMeasureA, resultA);
            queryDataResults.addResult(selectorA, fieldA, continuousMeasureB, resultB);

            // ACT
            const result = queryDataResults.getResult(selectorA, fieldA, categoricalMeasureB);

            // ASSERT
            expect(result).toBe(resultB);
        })

        it('gets the correct result for metric from multiple categorical measures', () => {
            // ARRANGE
            queryDataResults.addResult(selectorA, fieldA, categoricalMeasureA, resultA);
            queryDataResults.addResult(selectorA, fieldA, categoricalMeasureB, resultB);

            // ACT
            const result = queryDataResults.getResult(selectorA, fieldA, categoricalMeasureB);

            // ASSERT
            expect(result).toBe(resultB);
        })

        it('gets the correct result for metric from multiple measure types', () => {
            // ARRANGE
            queryDataResults.addResult(selectorA, fieldA, continuousMeasureA, resultA);
            queryDataResults.addResult(selectorA, fieldA, categoricalMeasureB, resultB);

            // ACT
            const result = queryDataResults.getResult(selectorA, fieldA, continuousMeasureA);

            // ASSERT
            expect(result).toBe(resultA);
        })

        it('gets the correct result from multiple fields', () => {
            // ARRANGE
            queryDataResults.addResult(selectorA, fieldA, continuousMeasureA, resultA);
            queryDataResults.addResult(selectorA, fieldB, continuousMeasureA, resultB);

            // ACT
            const result = queryDataResults.getResult(selectorA, fieldB, continuousMeasureA);

            // ASSERT
            expect(result).toBe(resultB);
        })

        it('gets the correct result from multiple selectors', () => {
            // ARRANGE
            queryDataResults.addResult(selectorA, fieldA, continuousMeasureA, resultA);
            queryDataResults.addResult(selectorB, fieldA, continuousMeasureA, resultB);

            // ACT
            const result = queryDataResults.getResult(selectorB, fieldA, continuousMeasureA);

            // ASSERT
            expect(result).toBe(resultB);
        })
    })

    describe('field results portion', () => {
        it('when result is not present for field, an error is thrown', () => {
            expect(() => queryDataResults.getFieldResults(selectorA, fieldA)).toThrowError();
        })

        it('gets the correct result for metric from multiple continuous measures', () => {
            // ARRANGE
            queryDataResults.addResult(selectorA, fieldA, continuousMeasureA, resultA);
            queryDataResults.addResult(selectorA, fieldA, continuousMeasureB, resultB);

            // ACT
            const results = queryDataResults.getFieldResults(selectorA, fieldA);

            // ASSERT
            expect(results).toHaveLength(2);
            expect(results[0]).toBe(resultA);
            expect(results[1]).toBe(resultB);
        })
    })
})