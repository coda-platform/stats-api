import FieldInfo from "../../models/fieldInfo";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import FieldPathDecomposed from "./fieldPathDecomposed";
import arrayFieldDetector from "./fields/arrayFieldDetector";
import filterOperatorHelper from "./filters/filterOperatorHelper";
import queryStringEscaper from "./queryStringEscaper";

function formatValueForSql(filter: Filter, fieldInfo: FieldInfo): string {
    const value = queryStringEscaper.escape(String(filter.value));

    const filterOperator = filter.operator.replace(/_/g, '').toLowerCase();

    if (filterOperatorHelper.isNullOperator(filter)) {
        return '';
    }

    if (filterOperatorHelper.isNullValue(filter)) {
        return value;
    }

    if (['within', 'interval'].some(op => op === filterOperator)) {
        return `now() - interval '${value} hours'`;
    }

    const fieldType = fieldInfo.type.toLowerCase();

    switch (fieldType) {
        case 'text':
            return `'${value}'`;
        case 'boolean':
            return `${value}`;
        case 'float':
            return `${value}`;
        default:
            return `'${value}'`;
    }
}

function formatIndexValueForSql(value: string | boolean | number, path: string, selector: Selector): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);


    while (pathDecomposed.length > 1) {
        const currentPathElement = pathDecomposed.next().value;
        if (arrayFieldDetector.isArrayField(currentPathElement.path, selector)) {
            break; //skip to first field after first array
        }
    }

    const valuePath = recursiveBuildIndexValueForSql(value, pathDecomposed, selector);

    return `'[{${valuePath}}]'`;
}

function recursiveBuildIndexValueForSql(value: string | boolean | number, path: FieldPathDecomposed, selector: Selector): string {

    const decomposedPath = path.next();
    const currentPath = decomposedPath.value;
    const isPathDone = path.length < 1;

    if (arrayFieldDetector.isArrayPathElement(currentPath.path, selector)) {
        if (isPathDone)
            return `"${currentPath.pathElement}":[${value}]`;
        else {
            const nextPath = recursiveBuildIndexValueForSql(value, path, selector);
            return `"${currentPath.pathElement}":[{${nextPath}}]`;
        }
    }
    else {
        if (isPathDone)
            return `"${currentPath.pathElement}":"${value}"`;
        else {
            const nextPath = recursiveBuildIndexValueForSql(value, path, selector);
            return `"${currentPath.pathElement}":{${nextPath}}`;
        }
    }
}

export default {
    formatValueForSql, formatIndexValueForSql
};