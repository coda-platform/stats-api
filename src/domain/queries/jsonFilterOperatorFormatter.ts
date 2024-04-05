import Filter from "../../models/request/filter";
import { ResponseError } from "../../utils/responseError";
import filterOperatorHelper from "./filters/filterOperatorHelper";

type EqualOperator = "is" | "is not" | "is NULL" | "is not NULL" | "=" | "!=" | ">" | ">=" | "<" | "<=" | "LIKE";

function formatOperatorForSql(filter: Filter): EqualOperator {
    const filterOperator = filterOperatorHelper.normalize(filter);

    if(['isnull'].some(op => op === filterOperator)) {
        return 'is NULL';
    }
    if(['isnotnull'].some(op => op === filterOperator)) {
        return 'is not NULL';
    }
    if (['is', 'equals', 'on', 'equal'].some(op => op === filterOperator)) {
        if(filterOperatorHelper.isNullValue(filter)) return 'is';
        return '=';
    }

    if (['not', 'isnot', 'notequals', 'noton', 'notequal'].some(op => op === filterOperator)) {
        if(filterOperatorHelper.isNullValue(filter)) return 'is not';
        return '!=';
    }

    if (['after', 'morethan', 'greater'].some(op => op === filterOperator)) {
        return '>';
    }

    if (['afteroron', 'moreorequalthan', 'greaterorequal'].some(op => op === filterOperator)) {
        return '>=';
    }

    if (['before', 'lessthan', 'less'].some(op => op === filterOperator)) {
        return '<';
    }

    if (['beforeoron', 'lessorequalthan', 'lessorequal'].some(op => op === filterOperator)) {
        return '<=';
    }

    if (['matches', 'like'].some(op => op === filterOperator)) {
        return 'LIKE';
    }

    if (['within', 'interval'].some(op => op === filterOperator)) {
        return '>';
    }

    const error = new Error(`Operator '${filterOperator}' is not supported`) as ResponseError;
    error.status = 400;
    throw error;
}

export default {
    formatOperatorForSql
};