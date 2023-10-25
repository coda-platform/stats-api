import Filter, { instanceOfFilter } from "./filter";
import { ConditionOperator } from "./conditionOperator";

export default interface Condition {
    conditionOperator: ConditionOperator;
    conditions: Array<Condition|Filter>
}

function instanceOfCondition(object:any): object is Condition {
    return 'conditionOperator' in object;
}

function flattenConditionToFilters(condition:Condition): Filter[] {
    return condition.conditions.reduce((result:Filter[], next) => {
        if(instanceOfFilter(next)){
            result.push(next);
        }
        else{
            result = result.concat(flattenConditionToFilters(next))
        }
        return result
    }, [])
}

export { 
    instanceOfCondition, flattenConditionToFilters
}