import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import possibleComputedFilters from "../../../possibleComputedFilters";
import jsonFieldValuePathCompiler from "../../../queries/jsonFieldValuePathCompiler";
import jsonFilterOperatorFormatter from "../../../queries/jsonFilterOperatorFormatter";
import jsonQueryValueFormatter from "../../../queries/jsonQueryValueFormatter";
import arrayFieldDetector from "../../fields/arrayFieldDetector";
import filterOperatorHelper from "../../filters/filterOperatorHelper";
import Condition, { instanceOfCondition } from "../../../../models/request/condition";
import queryStringEscaper from "../../queryStringEscaper";

function getFilterNormalized(filter: Filter, filterFields: Map<Filter, FieldInfo>, selector: Selector, possibleComputedField?: Field): string {

    const filterValue = queryStringEscaper.escape(String(filter.value));
    const fieldInfo = filterFields.get(filter);
    if (!fieldInfo) throw new Error('No matching field for filter.');

    if (possibleComputedField) {
        const addedFieldFilter = possibleComputedFilters.possibleComputedFilters.get(possibleComputedField.path);
        if (addedFieldFilter)
            return (addedFieldFilter);
    }

    const isArrayField = arrayFieldDetector.isArrayField(filter.path, selector);
    const jsonFieldValuePathCompiled = jsonFieldValuePathCompiler.getFilterPathCompiled(filter, selector);

    const formattedFilterValue = isArrayField && filterOperatorHelper.isEqualsOperator(filter)
        ? jsonQueryValueFormatter.formatIndexValueForSql(filterValue, filter.path, selector)
        : jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);
    const sqlOperand = isArrayField && filterOperatorHelper.isEqualsOperator(filter)
        ? "@>"
        : jsonFilterOperatorFormatter.formatOperatorForSql(filter);
    const cast = fieldInfo.type;
    return (isArrayField && filterOperatorHelper.isEqualsOperator(filter))
        || (filterOperatorHelper.isNullOperator(filter) || filterOperatorHelper.isNullValue(filter))
        ? `${jsonFieldValuePathCompiled} ${sqlOperand} ${formattedFilterValue}`
        : `(${jsonFieldValuePathCompiled})::${cast} ${sqlOperand} ${formattedFilterValue}`;
}

function build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>): string {
    return buildFilterGrouping(selector.condition, selector, filterFieldTypes);
}

function buildFilterGrouping(condition: Condition, selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>): string {
    const filtersNormalized: string[] = [];
    condition.conditions.forEach(f => {
        if (instanceOfCondition(f)) {
            filtersNormalized.push(`(${buildFilterGrouping(f, selector, filterFieldTypes)})`);
        }
        else {
            filtersNormalized.push(getFilterNormalized(f, filterFieldTypes, selector));
        }
    });

    return filtersNormalized.join(` ${condition.conditionOperator} `);
}

export default {
    build
};