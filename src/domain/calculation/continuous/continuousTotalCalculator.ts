import { count } from "console";
import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): number | String {
    
    const countResults = queryDataResults.getResult(selector, field, measure);
    if(countResults instanceof Error){//no result
        return countResults.message
    }
    else if(countResults.result instanceof Error){//db error
        return countResults.result.message
    }
    return countResults.result[0].sum;
}

export default {
    calculate
}