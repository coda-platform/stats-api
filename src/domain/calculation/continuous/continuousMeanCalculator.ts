import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import ContinuousMeanResponse from "../../../models/response/continuousMeanResponse";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): ContinuousMeanResponse | string {

    const countResults = queryDataResults.getResult(selector, field, measure);
    if(countResults instanceof Error){
        return countResults.message;
    }
    else if(countResults.result instanceof Error){
        return countResults.result.message;
    }
    return {
        mean: countResults.result[0].mean,
        populationSize: countResults.result[0].count
    };
}

export default {
    calculate
};