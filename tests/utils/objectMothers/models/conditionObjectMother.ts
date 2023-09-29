import Filter from "../../../../src/models/request/filter";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import Condition from "../../../../src/models/request/condition";

function get(conditionOperator: ConditionOperator, ConditionOrFilter?: Array<Condition|Filter>): Condition {
    return {
        conditionOperator: conditionOperator,
        conditions: ConditionOrFilter ? ConditionOrFilter : []
    }
}

export default {
    get
}