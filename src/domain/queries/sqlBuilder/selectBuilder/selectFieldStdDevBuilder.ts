import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import calculatedFields from "../../../calculatedFields";
import fieldLabelFormatter from "../../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(field: Field, fieldTypes: Map<Field, FieldInfo>, selector:Selector) {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);
    const fieldType = fieldTypes.get(field);
    const isJoinField = !selector.fields.some(f => f.label === field.label);

    const calculatedField = calculatedFields.get(selector, fieldPath);
    if (calculatedField) {
        if(isJoinField){
            return fieldType ?
            `STDDEV((${fieldLabelFormatted})::${fieldType.type}) AS stddev` : `STDDEV(${fieldLabelFormatted}) AS stddev`;
        }
        return fieldType ?
            `STDDEV((${calculatedField})::${fieldType.type}) AS stddev`: `STDDEV(${calculatedField}) AS stddev`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getFieldPathCompiled(fieldPath, selector);

    if(isJoinField){
        return fieldType ?
        `STDDEV((${fieldLabelFormatted})::${fieldType.type}) AS stddev` : `STDDEV(${fieldLabelFormatted}) AS stddev`;
    }
    return fieldType ?
        `STDDEV((${jsonFieldPathCompiled})::${fieldType.type}) AS stddev`: `STDDEV(${jsonFieldPathCompiled}) AS stddev`;
}

export default {
    build
};