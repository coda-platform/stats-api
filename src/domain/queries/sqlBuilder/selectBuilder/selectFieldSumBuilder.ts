import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import calculatedFields from "../../../calculatedFields";
import fieldLabelFormatter from "../../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(field: Field, fieldTypes: Map<Field, FieldInfo>, selector: Selector) {
    const fieldPath = field.path;
    const cast = fieldTypes.get(field)?.type;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);
    const isJoinField = !selector.fields.some(f => f.label === field.label);

    const calculatedField = calculatedFields.calculatedFields.get(fieldPath);
    if (calculatedField) {
        if(isJoinField){
            return `SUM(${fieldLabelFormatted}) AS sum`;
        }
        return `SUM(${calculatedField}) AS sum`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);

    if(isJoinField){
        return  cast ? `SUM((${fieldLabelFormatted})::${cast}) AS sum` : `SUM(${fieldLabelFormatted}) AS sum`;
    }
    return  cast ? `SUM((${jsonFieldPathCompiled})::${cast}) AS sum` : `SUM(${jsonFieldPathCompiled}) AS sum`;
}

export default {
    build
};