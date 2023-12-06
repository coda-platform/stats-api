import Condition from "../../../../src/models/request/condition";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import Filter from "../../../../src/models/request/filter";

function get(conditionOperator: ConditionOperator, conditions: Filter[] ): Condition {
    return {
        conditionOperator,
        conditions
    };
}

export default {
    get
};