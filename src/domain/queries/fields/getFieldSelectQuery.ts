import fieldLabelFormatter from "../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../queries/jsonFieldValuePathCompiler";
import Field from "../../../models/request/field";
import calculatedFields from "../../calculatedFields";
import Selector from "../../../models/request/selector";

function getQuery(field: Field, selector: Selector): string {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);

    const calculatedField = calculatedFields.get(selector, fieldPath);
    if (calculatedField) {
        return `${calculatedField} as ${fieldLabelFormatted}`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getFieldPathCompiled(fieldPath, selector);

    return `${jsonFieldPathCompiled} AS ${fieldLabelFormatted}`;
}

function getJsonQuery(field: Field, selector: Selector): string {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);

    const calculatedField = calculatedFields.get(selector, fieldPath);
    if (calculatedField) {
        return `${calculatedField} as ${fieldLabelFormatted}`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getJsonPathCompiled(fieldPath, selector);

    return `${jsonFieldPathCompiled} AS ${fieldLabelFormatted}`;
}

function getCastedQuery(field: Field, cast:string, selector: Selector): string {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);

    const calculatedField = calculatedFields.get(selector, fieldPath);
    if (calculatedField) {
        return `${calculatedField} as ${fieldLabelFormatted}`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getFieldPathCompiled(fieldPath, selector);

    return `(${jsonFieldPathCompiled})::${cast} AS ${fieldLabelFormatted}`;
}

export default {
    getQuery, getJsonQuery, getCastedQuery
};