import Field from "../../../../models/request/field";
import fieldLabelFormatter from "../../fieldLabelFormatter";

function build(field: Field) {
    const fieldLabelFormatted = fieldLabelFormatter.formatLabel(field.label);
    return ` ${fieldLabelFormatted}`;
}

export default {
    build
};