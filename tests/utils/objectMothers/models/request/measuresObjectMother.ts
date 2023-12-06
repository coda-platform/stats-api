import CategoricalMesure from "../../../../../src/models/categoricalMeasure";
import ContinuousMesure from "../../../../../src/models/continuousMeasure";
import Measures from "../../../../../src/models/request/measures";

function get(categorical?: CategoricalMesure[], continuous?: ContinuousMesure[]): Measures {
    categorical = categorical ?? [];
    continuous = continuous ?? [];

    return {
        categorical,
        continuous
    };
}

function getAllOptionMeasures(): Measures {
    return {
        categorical: [CategoricalMesure.count, CategoricalMesure.mode, CategoricalMesure.marginals],
        continuous: [ContinuousMesure.count, ContinuousMesure.mean, ContinuousMesure.stdev, ContinuousMesure.ci95]
    };
}

export default {
    get,
    getAllOptionMeasures
};