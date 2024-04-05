import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import calculatedFields from "../../../calculatedFields";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";

function build(field: Field, selector: Selector): string {
    const fieldPath = field.path;

    const calculatedField = calculatedFields.get(selector, fieldPath);
    if (calculatedField) {
        return calculatedField;
    }
    
    const jsonFieldPathCompiled = jsonFieldValuePathCompiler.getFieldPathCompiled(fieldPath, selector);

    return jsonFieldPathCompiled;
}

export default {
    build
};