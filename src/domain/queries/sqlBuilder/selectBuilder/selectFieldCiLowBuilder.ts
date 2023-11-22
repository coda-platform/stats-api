import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import calculatedFields from "../../../calculatedFields";
import fieldLabelFormatter from "../../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(field: Field, fieldTypes: Map<Field, FieldInfo>,selector: Selector) {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);
    const fieldType = fieldTypes.get(field);
    const isJoinField = !selector.fields.some(f => f.label === field.label);

    const calculatedField = calculatedFields.calculatedFields.get(fieldPath);
    if (calculatedField) {
        if(isJoinField){
            return fieldType ?
            `percentile_disc(0.05) within group (order by (${fieldLabelFormatted})::${fieldType.type}) AS ci_low` : `percentile_disc(0.05) within group (order by ${fieldLabelFormatted}) AS ci_low`;
        }
        return fieldType ?
        `percentile_disc(0.05) within group (order by (${calculatedField})::${fieldType.type}) AS ci_low` : `percentile_disc(0.05) within group (order by ${calculatedField}) AS ci_low`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);

    if(isJoinField){
        return fieldType ?
        `percentile_disc(0.05) within group (order by (${fieldLabelFormatted})::${fieldType.type}) AS ci_low` : `percentile_disc(0.05) within group (order by ${fieldLabelFormatted}) AS ci_low`;
    }
    return fieldType ?
    `percentile_disc(0.05) within group (order by (${jsonFieldPathCompiled})::${fieldType.type}) AS ci_low` : `percentile_disc(0.05) within group (order by ${jsonFieldPathCompiled}) AS ci_low`;
}

export default {
    build
};