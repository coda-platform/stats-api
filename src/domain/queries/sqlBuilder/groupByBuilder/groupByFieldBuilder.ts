import Field from "../../../../models/request/field";
import calculatedFields from "../../../calculatedFields";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(field: Field) {
    const fieldPath = field.path;

    const calculatedField = calculatedFields.calculatedFields.get(fieldPath);
    if (calculatedField) {
        return calculatedField;
    }

    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getPathCompiled(fieldPath);

    return jsonFieldPathCompiled;
}

export default {
    build
};