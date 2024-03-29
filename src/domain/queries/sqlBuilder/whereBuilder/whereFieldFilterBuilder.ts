import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import possibleComputedFilters from "../../../possibleComputedFilters";
import jsonFieldValuePathCompiler from "../../../queries/jsonFieldValuePathCompiler";
import jsonFilterOperatorFormatter from "../../../queries/jsonFilterOperatorFormatter";
import jsonQueryValueFormatter from "../../../queries/jsonQueryValueFormatter";
import arrayFieldDetector from "../../fields/arrayFieldDetector";
import WhereJsonArrayFormatterBuilder from "./whereJsonArrayFormatterBuilder";
import Condition, { instanceOfCondition } from "../../../../models/request/condition";

function getFilterNormalized(filter: Filter, filterFields: Map<Filter, FieldInfo>, selector: Selector): string {
    const fieldInfo = filterFields.get(filter);
    if (!fieldInfo) throw new Error('No matching field for filter.');

    const isArrayField = arrayFieldDetector.isArrayField(filter.path);
    const jsonFieldValuePathCompiled = isArrayField
        ? new WhereJsonArrayFormatterBuilder(filter.path, selector.label).build()
        : jsonFieldValuePathCompiler.getPathCompiled(filter.path);

    const filterValue = isArrayField
        ? jsonQueryValueFormatter.formatIndexValueForSql(filter.value, filter.path)
        : jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);
    const sqlOperand = isArrayField
        ? "@>"
        : jsonFilterOperatorFormatter.formatOperatorForSql(filter);
    const cast = fieldInfo.type;
    return isArrayField
        ? `${jsonFieldValuePathCompiled} ${sqlOperand} ${filterValue}`
        : `(${jsonFieldValuePathCompiled})::${cast} ${sqlOperand} ${filterValue}`;
}

function build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>, possibleComputedField?: Field, condition?: Condition): string {
    const filtersNormalized: string[] = [];

    if (possibleComputedField) {
        const addedFieldFilter = possibleComputedFilters.possibleComputedFilters.get(possibleComputedField.path);
        if (addedFieldFilter)
            filtersNormalized.push(addedFieldFilter);
    }
    const conditions = condition ? condition.conditions : selector.condition ? selector.condition.conditions : [];
    conditions.forEach((filter: Filter | Condition) => {
        if (instanceOfCondition(filter)) {
            filtersNormalized.push(`(${build(selector, filterFieldTypes, undefined ,filter)})`);
        }
        else {
            filtersNormalized.push(getFilterNormalized(filter, filterFieldTypes, selector));
        }
    });
    if (filtersNormalized.length === 0) return '';
    const conditionOperator = condition?.conditionOperator ?? selector.condition?.conditionOperator ?? 'AND';
    return filtersNormalized.join(` ${conditionOperator} `);
}

export default {
    build
};