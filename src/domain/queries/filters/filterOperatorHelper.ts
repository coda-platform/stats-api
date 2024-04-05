import Filter from "../../../models/request/filter";
import jsonFilterOperatorFormatter from "../jsonFilterOperatorFormatter";
import queryStringEscaper from "../queryStringEscaper";

function isComparisonOperator(filter: Filter): boolean {
    const operator = jsonFilterOperatorFormatter.formatOperatorForSql(filter);
    return ['>', '>=', '<', '<=', 'is NULL', 'is not NULL'].some(op => op === operator) || isNullValue(filter);
}

function isEqualsOperator(filter: Filter): boolean {
    if(isNullValue(filter)) return false;
    const operator = jsonFilterOperatorFormatter.formatOperatorForSql(filter);
    return operator === '=';
}

function isNullOperator(filter: Filter): boolean {
    const operator = jsonFilterOperatorFormatter.formatOperatorForSql(filter);
    return ['is NULL', 'is not NULL'].some(op => op === operator);
}

function isNullValue(filter: Filter): boolean {
    const value = queryStringEscaper.escape(String(filter.value));
    return String(value).toLowerCase() === 'null';
}

function normalize(filter: Filter): string{
    const filterOperator = queryStringEscaper.escape(filter.operator.replace(/_/g, '').toLowerCase());
    return filterOperator;
}

export default {
    isComparisonOperator, isEqualsOperator, isNullValue, normalize, isNullOperator
};