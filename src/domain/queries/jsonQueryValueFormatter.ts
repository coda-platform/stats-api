import FieldInfo from "../../models/fieldInfo";
import Filter from "../../models/request/filter";
import FieldPathDecomposed from "./fieldPathDecomposed";
import arrayFieldDetector from "./fields/arrayFieldDetector";
import queryStringEscaper from "./queryStringEscaper";

function formatValueForSql(filter: Filter, fieldInfo: FieldInfo) {
    const value = String(filter.value);

    const filterOperator = filter.operator.replace(/_/g, '').toLowerCase();
    if(String(value).toLowerCase() === 'null' && ['is', 'equals', 'on', 'equal'].some(op => op === filterOperator)) return value;
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

function formatIndexValueForSql(value: string | boolean | number, path: string): string{
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);


    while (pathDecomposed.length > 1) {
        const currentPathElement = pathDecomposed.next().value;
        if(arrayFieldDetector.isArrayField(currentPathElement.path)){
            break; //skip to first field after first array
        }
    }

    const valuePath = recursiveBuildIndexValueForSql(value, pathDecomposed);

    return `'[{${valuePath}}]'`;
}

function recursiveBuildIndexValueForSql(value: string | boolean | number, path: FieldPathDecomposed): string{

    const decomposedPath = path.next();
    const currentPath = decomposedPath.value;
    const isPathDone = path.length < 1;

    if(arrayFieldDetector.isArrayPathElement(currentPath.path)){
        if(isPathDone)
            return `"${currentPath.pathElement}":[${value}]`;
        else{
            const nextPath = recursiveBuildIndexValueForSql(value, path);
            return  `"${currentPath.pathElement}":[{${nextPath}}]`;
        }
    }
    else {
        if(isPathDone)
            return `"${currentPath.pathElement}":"${value}"`;
        else{
            const nextPath = recursiveBuildIndexValueForSql(value, path);
            return  `"${currentPath.pathElement}":{${nextPath}}`;
        }
    }
}

export default {
    formatValueForSql, formatIndexValueForSql
};