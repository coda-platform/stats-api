import continuousConfidenceIntervalCalculator from "../../../src/domain/calculation/continuous/continuousConfidenceIntervalCalculator";
import continuousMeanCalculator from "../../../src/domain/calculation/continuous/continuousMeanCalculator";
import continuousStandardDeviationCalculator from "../../../src/domain/calculation/continuous/continuousStandardDeviationCalculator";
import continuousTotalCalculator from "../../../src/domain/calculation/continuous/continuousTotalCalculator";
import discreteCountCalculator from "../../../src/domain/calculation/discrete/discreteCountCalculator";
import discreteMarginalCalculator from "../../../src/domain/calculation/discrete/discreteMarginalCalculator";
import discreteModeCalculator from "../../../src/domain/calculation/discrete/discreteModeCalculator";
import FieldMetricCalculator from "../../../src/domain/calculation/fieldMetricCalculator";
import fieldMetricCalculatorsFactory from "../../../src/domain/calculation/fieldMetricCalculatorsFactory";
import QueryDataResults from "../../../src/domain/queries/queryDataResults";
import FieldInfo from "../../../src/models/fieldInfo";
import CategoricalMesure from "../../../src/models/categoricalMeasure";
import ContinuousMesure from "../../../src/models/continuousMeasure";
import Field from "../../../src/models/request/field";
import Selector from "../../../src/models/request/selector";
import fieldInfoObjectMother from "../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import measuresObjectMother from "../../utils/objectMothers/models/request/measuresObjectMother";
import constants from "../../../src/constants";

describe('fieldMetricsFactory tests', () => {
    const allOptionsMeasures = measuresObjectMother.getAllOptionMeasures();
    const numericalTypes = constants.numericalTypes;

    numericalTypes.forEach(fieldType => {
        it(`${fieldType} field, all metrics chosen, all continuous metrics gotten`, () => {
            // ARRANGE
            const field = fieldObjectMother.get('field', 'field', 'string');
            const aidboxField = fieldInfoObjectMother.get(fieldType);

            const fieldsMap = getFieldsMap([field], [aidboxField]);

            // ACT
            const fieldCalculators = fieldMetricCalculatorsFactory.get(field, allOptionsMeasures, fieldsMap);

            // ASSERT
            expect(fieldCalculators.length).toEqual(4);

            expectCalculatorIs(fieldCalculators[0], ContinuousMesure.count, continuousTotalCalculator.calculate);
            expectCalculatorIs(fieldCalculators[1], ContinuousMesure.mean, continuousMeanCalculator.calculate);
            expectCalculatorIs(fieldCalculators[2], ContinuousMesure.stdev, continuousStandardDeviationCalculator.calculate);
            expectCalculatorIs(fieldCalculators[3], ContinuousMesure.ci95, continuousConfidenceIntervalCalculator.calculate);
        });

        it(`${fieldType} field, two measures chosen, both continuous metrics gotten`, () => {
            // ARRANGE
            const measures = measuresObjectMother.get([], [ContinuousMesure.count, ContinuousMesure.stdev]);
            const field = fieldObjectMother.get('field', 'field', 'string');
            const aidboxField = fieldInfoObjectMother.get(fieldType);

            const fieldsMap = getFieldsMap([field], [aidboxField]);

            // ACT
            const fieldCalculators = fieldMetricCalculatorsFactory.get(field, measures, fieldsMap);

            // ASSERT
            expect(fieldCalculators.length).toEqual(2);

            expectCalculatorIs(fieldCalculators[0], ContinuousMesure.count, continuousTotalCalculator.calculate);
            expectCalculatorIs(fieldCalculators[1], ContinuousMesure.stdev, continuousStandardDeviationCalculator.calculate);
        });
    });

    it(`string field, all metrics chosen, all categorical metrics gotten`, () => {
        // ARRANGE
        const field = fieldObjectMother.get('field', 'field', 'string');
        const aidboxField = fieldInfoObjectMother.get('string');

        const fieldsMap = getFieldsMap([field], [aidboxField]);

        // ACT
        const fieldCalculators = fieldMetricCalculatorsFactory.get(field, allOptionsMeasures, fieldsMap);

        // ASSERT
        expect(fieldCalculators.length).toEqual(3);

        expectCalculatorIs(fieldCalculators[0], CategoricalMesure.count, discreteCountCalculator.calculate);
        expectCalculatorIs(fieldCalculators[1], CategoricalMesure.mode, discreteModeCalculator.calculate);
        expectCalculatorIs(fieldCalculators[2], CategoricalMesure.marginals, discreteMarginalCalculator.calculate);
    });

    it(`string field, two measures chosen, both categorical metrics gotten`, () => {
        // ARRANGE
        const measures = measuresObjectMother.get([CategoricalMesure.count, CategoricalMesure.marginals], []);
        const field = fieldObjectMother.get('field', 'field', 'string');
        const aidboxField = fieldInfoObjectMother.get('string');

        const fieldsMap = getFieldsMap([field], [aidboxField]);

        // ACT
        const fieldCalculators = fieldMetricCalculatorsFactory.get(field, measures, fieldsMap);

        // ASSERT
        expect(fieldCalculators.length).toEqual(2);

        expectCalculatorIs(fieldCalculators[0], CategoricalMesure.count, discreteCountCalculator.calculate);
        expectCalculatorIs(fieldCalculators[1], CategoricalMesure.marginals, discreteMarginalCalculator.calculate);
    });

    function getFieldsMap(fields: Field[], aidboxFields: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], aidboxFields[fieldIndex]);
        }

        return fieldsMap;
    }

    function expectCalculatorIs(fieldCalculator: FieldMetricCalculator, type: ContinuousMesure | CategoricalMesure,
        calculationFunction: (selector: Selector,
            queryDataResults: QueryDataResults,
            field: Field,
            measure: ContinuousMesure | CategoricalMesure) => any) {

        expect(fieldCalculator.metric).toEqual(type);
        expect(fieldCalculator.metricCalculation).toBe(calculationFunction);
    }
});