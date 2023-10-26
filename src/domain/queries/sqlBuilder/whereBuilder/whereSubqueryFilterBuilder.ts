import FieldInfo from "../../../../models/fieldInfo";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import fieldPathFormatter from "../../fieldPathFormatter";
import jsonFilterOperatorFormatter from "../../../queries/jsonFilterOperatorFormatter";
import jsonQueryValueFormatter from "../../../queries/jsonQueryValueFormatter";
import { instanceOfCondition } from "../../../../models/request/condition";

function getFilterNormalized(filter: Filter, filterFields: Map<Filter, FieldInfo>, subqueryName: string) {
    const fieldInfo = filterFields.get(filter);
    if (!fieldInfo) throw new Error('No matching field for filter.')

    const filterPathNormalized = `${subqueryName}.${fieldPathFormatter.formatPath(filter.path)}`;
    const filterValue = jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);
    const sqlOperant = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

    return `${filterPathNormalized} ${sqlOperant} ${filterValue}`;
}

function build(selector: Selector, filterFields: Map<Filter, FieldInfo>, subqueryName: string) {
    const filtersNormalized: string[] = []
    const conditions = selector.condition ? selector.condition.conditions : []
    conditions.forEach(f => {
        if (instanceOfCondition(f)) {
            filtersNormalized.push(`(${build(selector, filterFields, subqueryName)})`)
        }
        else {
            filtersNormalized.push(getFilterNormalized(f, filterFields, subqueryName))
        }
    })
    if (filtersNormalized.length === 0) return ''
    return filtersNormalized.join(` ${selector.condition.conditionOperator} `)
}

export default {
    build
}