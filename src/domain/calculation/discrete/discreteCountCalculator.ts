import CategoricalMesure from "../../../models/categoricalMeasure";
import ContinuousMesure from "../../../models/continuousMeasure";
import Field from "../../../models/request/field";
import Selector from "../../../models/request/selector";
import DiscreteVariableCountReponse from "../../../models/response/discreteVariableCountReponse";
import fieldLabelFormatter from "../../queries/fieldLabelFormatter";
import QueryDataResults from "../../queries/queryDataResults";

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    field: Field,
    measure: ContinuousMesure | CategoricalMesure): DiscreteVariableCountReponse[] {

    const fieldLabelNormalized = fieldLabelFormatter.formatLabel(field.label);
    const countResults = queryDataResults.getResult(selector, field, measure);

    if(countResults instanceof Error){
        const discreteVariableCounts: Array<DiscreteVariableCountReponse> = [{ label: fieldLabelNormalized, value: 0, error: countResults.message }];
        return discreteVariableCounts;
    }
    else if(countResults.result instanceof Error){
        const discreteVariableCounts: Array<DiscreteVariableCountReponse> = [{ label: fieldLabelNormalized, value: 0, error: countResults.result.message }];
        return discreteVariableCounts;
    }


    const discreteVariableCounts = new Array<DiscreteVariableCountReponse>();

    if(countResults.result.length === 0){
        const discreteVariableCounts: Array<DiscreteVariableCountReponse>  = [{ label: fieldLabelNormalized, value: 0 }];
        return discreteVariableCounts;
    }

    countResults.result.forEach((countResult:any) => {
        const discreteVariableCount: DiscreteVariableCountReponse = {
            label: countResult[fieldLabelNormalized],
            value: countResult.count
        };

        discreteVariableCounts.push(discreteVariableCount);
    });

    return discreteVariableCounts;
}

export default {
    calculate
};