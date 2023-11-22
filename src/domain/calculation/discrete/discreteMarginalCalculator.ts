import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import DiscreteVariableMarginalResponse from "../../../models/response/discreteVariableMarginalReponse";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): DiscreteVariableMarginalResponse[] {

    throw new Error('Not implements');
}

export default {
    calculate
};