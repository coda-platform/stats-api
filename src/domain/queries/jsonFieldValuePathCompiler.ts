import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import calculatedFields from "../calculatedFields";
import resourceArrayFields from "../resourceArrayFields";
import FieldPathDecomposed from "./fieldPathDecomposed";
import arrayFieldDetector from "./fields/arrayFieldDetector";
import filterOperatorHelper from "./filters/filterOperatorHelper";
import queryStringEscaper from "./queryStringEscaper";

function getPathCompiled(fieldPathEscaped: string, selector: Selector, isField: boolean): string {
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    if (fieldPathEscaped === 'id'){ // 'id' field is not in resource
        return 'id';
    }

    let pathCompiled = 'resource';

    while (pathDecomposed.length > 0) {
        const currentPathElement = pathDecomposed.next().value;
        const isArray = arrayFieldDetector.isArrayPathElement(currentPathElement.path, selector);

        if (pathDecomposed.length === 0 && !isArray) {
            pathCompiled += `->>'${currentPathElement.pathElement}'`;
        } else {
            pathCompiled += `->'${currentPathElement.pathElement}'`;
        }

        if (isArray && isField) {
            pathCompiled = `jsonb_array_elements(${pathCompiled})`;
        }
    }
    return pathCompiled;
}

function getFilterPathCompiled(filter: Filter, selector: Selector): string {
    const fieldPathEscaped = queryStringEscaper.escape(filter.path);
    const isArrayField = arrayFieldDetector.isArrayField(fieldPathEscaped, selector);
    const selectorLabel = queryStringEscaper.escape(selector.label.toLowerCase());
    if(isArrayField && selectorLabel && filterOperatorHelper.isEqualsOperator(filter)){
        return getIndexPathCompiled(filter.path, selector);
    }
    else if(isArrayField && selectorLabel && filterOperatorHelper.isComparisonOperator(filter)){
        return getCrossJoinPathCompiled(filter.path, selector);
    }

    const calculatedField = calculatedFields.get(selector, filter.path);
    if (calculatedField) {
        return calculatedField;
    }
    return getPathCompiled(fieldPathEscaped, selector, false);
}

function getFieldPathCompiled(path: string, selector: Selector): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const calculatedField = calculatedFields.get(selector, path);
    if (calculatedField) {
        return calculatedField;
    }
    return getPathCompiled(fieldPathEscaped, selector, true);
}

function getJsonPathCompiled(path: string, selector: Selector): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    if (fieldPathEscaped === 'id') { // 'id' field is not in resource
        return 'id';
    }

    let pathCompiled = 'resource';

    while (pathDecomposed.length > 0) {
        const currentPathElement = pathDecomposed.next().value;
        const isArrayPathElement = resourceArrayFields.get(selector).some(v => v === currentPathElement.path);

        pathCompiled += `->'${currentPathElement.pathElement}'`;

        if (isArrayPathElement) {
            pathCompiled = `jsonb_array_elements(${pathCompiled})`;
        }
    }
    return pathCompiled;
}

function getIndexPathCompiled(path: string, selector:Selector): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const selectorLabel = queryStringEscaper.escape(selector.label.toLowerCase());
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    let pathCompiled = `${selectorLabel}_table.resource`;


    while (pathDecomposed.length > 1) {
        const currentPathElement = pathDecomposed.next().value;

        pathCompiled += `->'${currentPathElement.pathElement}'`;
        if(arrayFieldDetector.isArrayField(currentPathElement.path, selector)){
            break; //stop at first array field
        }
    }
    return pathCompiled;
}

function getCrossJoinPathCompiled(path: string, selector: Selector): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const selectorLabel = queryStringEscaper.escape(selector.label.toLowerCase());
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    let pathCompiled = `${selectorLabel}`;


    while (pathDecomposed.length > 1) {
        const currentPathElement = pathDecomposed.next().value;

        pathCompiled += `_${currentPathElement.pathElement}`;
        if(arrayFieldDetector.isArrayField(currentPathElement.path, selector)){
            break; //stop at first array field
        }
    }

    while (pathDecomposed.length > 0) {
        const currentPathElement = pathDecomposed.next().value;

        if (pathDecomposed.length === 0) {
            pathCompiled += `->>'${currentPathElement.pathElement}'`;
        } else {
            pathCompiled += `->'${currentPathElement.pathElement}'`;
        }
    }
    return pathCompiled;
}

export default {
    getFieldPathCompiled, getJsonPathCompiled, getIndexPathCompiled, getFilterPathCompiled
};
