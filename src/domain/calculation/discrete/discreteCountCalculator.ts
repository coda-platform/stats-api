import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import DiscreteVariableCountReponse from "../../../models/response/discreteVariableCountReponse";
import fieldLabelFormatter from "../../queries/fieldLabelFormatter";
import fieldPathFormatter from "../../queries/fieldPathFormatter";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): DiscreteVariableCountReponse[] | String {

    const countResults = queryDataResults.getResult(selector, field, measure);
    if(countResults instanceof Error){
        return countResults.message
    }
    else if(countResults.result instanceof Error){
        return countResults.result.message
    }
    const fieldLabelNormalized = fieldLabelFormatter.formatLabel(field.label);

    const discreteVariableCounts = new Array<DiscreteVariableCountReponse>();

    if(countResults.result.length == 0){
        const discreteVariableCounts  = [{ label: fieldLabelNormalized, value: 0 }];
        return discreteVariableCounts;
    }

    countResults.result.forEach((countResult:any) => {
        const discreteVariableCount: DiscreteVariableCountReponse = {
            label: countResult[fieldLabelNormalized],
            value: countResult.count
        }

        discreteVariableCounts.push(discreteVariableCount);
    });

    return discreteVariableCounts;
}

export default {
    calculate
}