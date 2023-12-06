import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import fieldPathFormatter from "../../queries/fieldPathFormatter";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): string | string {

    const countResults = queryDataResults.getResult(selector, field, measure);
    if(countResults instanceof Error){
        return countResults.message;
    }
    else if(countResults.result instanceof Error){
        return countResults.result.message;
    }
    const fieldPathNormalized = fieldPathFormatter.formatPath(field.path);

    const variableCounts = new Map<string, number>();

    countResults.result.forEach((countResult:any) => {
        variableCounts.set(countResult[fieldPathNormalized], countResult.count);
    });

    let mode = '';
    let modeTotal = 0;

    variableCounts.forEach((value, key) => {
        if (value <= modeTotal) return;

        mode = key;
        modeTotal = value;
    });

    return mode;
}

export default {
    calculate
};