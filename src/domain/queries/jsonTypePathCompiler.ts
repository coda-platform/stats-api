import resourceArrayFields from "../resourceArrayFields";
import FieldPathDecomposed from "./fieldPathDecomposed";
import queryStringEscaper from "./queryStringEscaper";
import calculatedFields from "../calculatedFields";
import Selector from "../../models/request/selector";

function getFieldPathCompiled(fieldPathEscaped: string, selector: Selector): string {
    const calculatedField = calculatedFields.get(selector, fieldPathEscaped);
    if (calculatedField) {
        return `pg_typeof(${calculatedField})`;
    }

    const pathDecomposed = new FieldPathDecomposed(fieldPathEscaped);

    if (fieldPathEscaped === 'id') {//'id' field is not in resource
        return 'pg_typeof(id)';
    }

    let pathCompiled = 'resource';

    while (pathDecomposed.length > 0) {
        const currentPathElement = pathDecomposed.next().value;
        pathCompiled += `->'${currentPathElement.pathElement}'`;

        if (resourceArrayFields.get(selector).some(v => v === currentPathElement.path)) {
            pathCompiled = `jsonb_array_elements(${pathCompiled})`;
        }
    }

    return `jsonb_typeof(${pathCompiled})`;
}

function getPathCompiled(fieldPath: string, selector: Selector): string {
    const fieldPathEscaped = queryStringEscaper.escape(fieldPath);

    return getFieldPathCompiled(fieldPathEscaped, selector);
}

export default {
    getPathCompiled
};