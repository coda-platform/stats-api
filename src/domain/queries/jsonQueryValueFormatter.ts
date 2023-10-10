import FieldInfo from "../../models/fieldInfo";
import Filter from "../../models/request/filter";
import queryStringEscaper from "./queryStringEscaper";

function formatValueForSql(filter: Filter, fieldInfo: FieldInfo) {
    const value = queryStringEscaper.escape(String(filter.value));

    const filterOperator = filter.operator.replace(/_/g, '').toLowerCase();
    if(String(value).toLowerCase() === 'null' && ['is', 'equals', 'on', 'equal'].some(op => op === filterOperator)) return value;

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

function formatIndexValueForSql(value: string | boolean | number, path: string){
    const pathArray = path.split(".");
    const lastPath = pathArray[pathArray.length -1]
    return `'[{"${lastPath}":"${value}"}]'`
}
export default {
    formatValueForSql, formatIndexValueForSql
}