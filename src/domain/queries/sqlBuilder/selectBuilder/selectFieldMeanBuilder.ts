import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import calculatedFields from "../../../calculatedFields";
import fieldLabelFormatter from "../../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(field: Field, fieldTypes: Map<Field, FieldInfo>, selector: Selector) {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);
    const fieldType = fieldTypes.get(field);
    const isJoinField = !selector.fields.some(f => f.label === field.label);

    const calculatedField = calculatedFields.calculatedFields.get(fieldPath);
    if (calculatedField) {
        if(isJoinField){
            return fieldType ?
            `AVG((${fieldLabelFormatted})::${fieldType.type}) AS mean` : `AVG(${fieldLabelFormatted}) AS mean`;
        }
        return fieldType ?
            `AVG((${calculatedField})::${fieldType.type}) AS mean` : `AVG(${calculatedField}) AS mean`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);

    if(isJoinField){
        return fieldType ?
        `AVG((${fieldLabelFormatted})::${fieldType.type}) AS mean` : `AVG(${fieldLabelFormatted}) AS mean`;
    }
        return fieldType ?
            `AVG((${jsonFieldPathCompiled})::${fieldType.type}) AS mean` : `AVG(${jsonFieldPathCompiled}) AS mean`;
}

export default {
    build
};