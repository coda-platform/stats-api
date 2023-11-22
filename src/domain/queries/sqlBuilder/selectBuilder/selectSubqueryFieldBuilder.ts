import Field from "../../../../models/request/field";
import fieldPathFormatter from "../../fieldPathFormatter";

function build(field: Field, subqueryName: string) {
    const fieldPathNormalized = fieldPathFormatter.formatPath(field.path);

    return `${subqueryName}.${fieldPathNormalized}`;
}

export default {
    build
};