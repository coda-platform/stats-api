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
    const isArrayField = arrayFieldDetector.isArrayField(fieldPath);

    const calculatedField = calculatedFields.calculatedFields.get(fieldPath);
    if (calculatedField) {
        if(isJoinField){
            return `count(${fieldLabelFormatted})`;
        }
        return `count(${calculatedField})`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);

    if(isJoinField || isArrayField){
        return `count(${fieldLabelFormatted})`;
    }
    return `count(${jsonFieldPathCompiled})`;
}

export default {
    build
};