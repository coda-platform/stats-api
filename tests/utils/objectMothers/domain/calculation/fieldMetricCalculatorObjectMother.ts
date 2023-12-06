import FieldMetricCalculator from "../../../../../src/domain/calculation/fieldMetricCalculator";
import QueryDataResults from "../../../../../src/domain/queries/queryDataResults";
import CategoricalMesure from "../../../../../src/models/categoricalMeasure";
import ContinuousMesure from "../../../../../src/models/continuousMeasure";
import Field from "../../../../../src/models/request/field";
import Selector from "../../../../../src/models/request/selector";

function get(metric: ContinuousMesure | CategoricalMesure,
    metricCalculation: (selector: Selector, queryDataResults: QueryDataResults, field: Field,
        measure: ContinuousMesure | CategoricalMesure) => any): FieldMetricCalculator {

    return { metric, metricCalculation };
}

export default {
    get
};