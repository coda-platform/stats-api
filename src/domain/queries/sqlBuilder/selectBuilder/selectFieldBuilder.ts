import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import calculatedFields from "../../../calculatedFields";
import fieldLabelFormatter from "../../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(field: Field, selector: Selector) {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);

    const calculatedField = calculatedFields.get(selector, fieldPath);
    if (calculatedField) {
        return `${calculatedField} as ${fieldLabelFormatted}`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getFieldPathCompiled(fieldPath, selector);

    return `${jsonFieldPathCompiled} AS ${fieldLabelFormatted}`;
}

export default {
    build
};