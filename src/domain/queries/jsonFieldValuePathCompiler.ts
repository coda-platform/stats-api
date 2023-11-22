import calculatedFields from "../calculatedFields";
import FieldPathDecomposed from "./fieldPathDecomposed";
import arrayFieldDetector from "./fields/arrayFieldDetector";
import queryStringEscaper from "./queryStringEscaper";

function getFieldPathCompiled(fieldPathEscaped: string): string {
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    let pathCompiled = 'resource';


    while (pathDecomposed.length > 0) {
        const currentPathElement = pathDecomposed.next().value;
        const isArrayPathElement = arrayFieldDetector.isArrayPathElement(currentPathElement.path); //case when building path for FIELD (no selector)

        if (pathDecomposed.length === 0 && !isArrayPathElement) {
            pathCompiled += `->>'${currentPathElement.pathElement}'`;
        } else {
            pathCompiled += `->'${currentPathElement.pathElement}'`;
        }

        if (isArrayPathElement) {
            pathCompiled = `jsonb_array_elements(${pathCompiled})`;
        }
    }

    return pathCompiled;
}

function getPathCompiled(path: string, selectorLabel?: string, filterPath?: boolean): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const isArrayField = arrayFieldDetector.isArrayField(path);

    if(isArrayField && selectorLabel && filterPath){
        return getArrayPathCompiled(path, selectorLabel);
    }

    const calculatedField = calculatedFields.calculatedFields.get(path);
    if (calculatedField) {
        return calculatedField;
    }
    return getFieldPathCompiled(fieldPathEscaped);
}

function getJsonPathCompiled(path: string): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    let pathCompiled = 'resource';


    while (pathDecomposed.length > 0) {
        const currentPathElement = pathDecomposed.next().value;
        const isArrayPathElement = arrayFieldDetector.isArrayPathElement(currentPathElement.path);

        pathCompiled += `->'${currentPathElement.pathElement}'`;

        if (isArrayPathElement) {
            pathCompiled = `jsonb_array_elements(${pathCompiled})`;
        }
    }

    return pathCompiled;
}

function getArrayPathCompiled(path: string, selectorLabel:string): string {
    const fieldPathEscaped = queryStringEscaper.escape(path);
    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    let pathCompiled = `${selectorLabel}_table.resource`;


    while (pathDecomposed.length > 1) {
        const currentPathElement = pathDecomposed.next().value;

        pathCompiled += `->'${currentPathElement.pathElement}'`;
        if(arrayFieldDetector.isArrayField(currentPathElement.path)){
            break; //stop at first array field
        }
    }

    return pathCompiled;
}
export default {
    getPathCompiled, getJsonPathCompiled, getArrayPathCompiled
};