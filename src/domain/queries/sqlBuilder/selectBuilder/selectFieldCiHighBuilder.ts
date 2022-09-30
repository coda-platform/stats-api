import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import calculatedSumFields from "../../../calculatedAggregatedFields";
import fieldLabelFormatter from "../../fieldLabelFormatter";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(field: Field, fieldTypes: Map<Field, FieldInfo>,selector: Selector) {
    const fieldPath = field.path;
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label)
    let fieldType = fieldTypes.get(field)
    const isJoinField = !selector.fields.some(f => f.label == field.label)
    
    const calculatedField = calculatedSumFields.calculatedSumFields.get(fieldPath);
    if (calculatedField) {
        if(isJoinField){
            return fieldType ?
            `percentile_disc(0.95) within group (order by (${fieldLabelFormatted})::${fieldType.type}) AS ci_high` : `percentile_disc(0.95) within group (order by ${fieldLabelFormatted}) AS ci_high`;
        }
        return fieldType ?
        `percentile_disc(0.95) within group (order by (${calculatedField})::${fieldType.type}) AS ci_high` : `percentile_disc(0.95) within group (order by ${calculatedField}) AS ci_high`;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);
    
    if(isJoinField){
        return fieldType ?
        `percentile_disc(0.95) within group (order by (${fieldLabelFormatted})::${fieldType.type}) AS ci_high` : `percentile_disc(0.95) within group (order by ${fieldLabelFormatted}) AS ci_high`;
    }
    return fieldType ?
    `percentile_disc(0.95) within group (order by (${jsonFieldPathCompiled})::${fieldType.type}) AS ci_high` : `percentile_disc(0.95) within group (order by ${jsonFieldPathCompiled}) AS ci_high`;
}

export default {
    build
}