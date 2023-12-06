import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): number[] | string {

    const ciResults = queryDataResults.getResult(selector, field, measure);
    if(ciResults instanceof Error){
        return ciResults.message;
    }
    else if(ciResults.result instanceof Error){
        return ciResults.result.message;
    }
    return [
        ciResults.result[0].ci_low,
        ciResults.result[0].ci_high
    ];
}

export default {
    calculate
};