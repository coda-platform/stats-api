import contants from "../../constants";
import FieldInfo from "../../models/fieldInfo";
import CategoricalMesure from "../../models/categoricalMeasure";
import ContinuousMesure from "../../models/continuousMeasure";
import Field from "../../models/request/field";
import Measures from "../../models/request/measures";
import Selector from "../../models/request/selector";
import QueryDataResults from "../queries/queryDataResults";
import continuousConfidenceIntervalCalculator from "./continuous/continuousConfidenceIntervalCalculator";
import continuousMeanCalculator from "./continuous/continuousMeanCalculator";
import continuousStandardDeviationCalculator from "./continuous/continuousStandardDeviationCalculator";
import continuousTotalCalculator from "./continuous/continuousTotalCalculator";
import discreteCountCalculator from "./discrete/discreteCountCalculator";
import discreteMarginalCalculator from "./discrete/discreteMarginalCalculator";
import discreteModeCalculator from "./discrete/discreteModeCalculator";
import FieldMetricCalculator from "./fieldMetricCalculator";

const categoricalTypesAndCalculations = new Map<string, (selector: Selector, queryDataResults: QueryDataResults, field: Field,
    measure: ContinuousMesure | CategoricalMesure) => any>();

categoricalTypesAndCalculations.set(CategoricalMesure.count, discreteCountCalculator.calculate);
categoricalTypesAndCalculations.set(CategoricalMesure.mode, discreteModeCalculator.calculate);
categoricalTypesAndCalculations.set(CategoricalMesure.marginals, discreteMarginalCalculator.calculate);

const continuousTypesAndCalculations = new Map<string, (selector: Selector, queryDataResults: QueryDataResults, field: Field,
    measure: ContinuousMesure | CategoricalMesure) => any>();
continuousTypesAndCalculations.set(ContinuousMesure.count, continuousTotalCalculator.calculate);
continuousTypesAndCalculations.set(ContinuousMesure.mean, continuousMeanCalculator.calculate);
continuousTypesAndCalculations.set(ContinuousMesure.stdev, continuousStandardDeviationCalculator.calculate);
continuousTypesAndCalculations.set(ContinuousMesure.ci95, continuousConfidenceIntervalCalculator.calculate);

function get(field: Field,
    measures: Measures,
    fieldTypes: Map<Field, FieldInfo>): FieldMetricCalculator[] {

    const aidboxField = fieldTypes.get(field);
    const isContinuous = contants.numericalTypes.some(nt => nt === aidboxField?.type);
    const measureOptions = isContinuous
        ? measures.continuous.map(c => c.toString())
        : measures.categorical.map(c => c.toString());

    const typesAndCalculations = contants.numericalTypes.some(nt => nt === aidboxField?.type)
        ? continuousTypesAndCalculations
        : categoricalTypesAndCalculations;

    return measureOptions.map((mo) => {
        const metricCalculation = typesAndCalculations.has(mo)
            ? typesAndCalculations.get(mo)
            : () => { throw new Error('Metric type not supported'); };

        const measureOptionCasted = isContinuous ? mo as ContinuousMesure : mo as CategoricalMesure;
        return { metric: measureOptionCasted, metricCalculation } as FieldMetricCalculator;
    });
}

export default {
    get
};