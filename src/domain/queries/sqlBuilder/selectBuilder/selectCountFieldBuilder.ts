import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import calculatedFields from "../../../calculatedFields";
import fieldLabelFormatter from "../../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";
import arrayFieldDetector from "../../fields/arrayFieldDetector";

function build(field: Field, selector: Selector) {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);
    const isJoinField = !selector.fields.some(f => f.label === field.label);
    const isArrayField = arrayFieldDetector.isArrayField(fieldPath, selector);

    const calculatedField = calculatedFields.get(selector, fieldPath);
    if (calculatedField) {
        if(isJoinField){
            return `count(${fieldLabelFormatted})`;
        }
        return `count(${calculatedField})`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getFieldPathCompiled(fieldPath, selector);

    if(isJoinField || isArrayField){
        return `count(${fieldLabelFormatted})`;
    }
    return `count(${jsonFieldPathCompiled})`;
}

export default {
    build
};