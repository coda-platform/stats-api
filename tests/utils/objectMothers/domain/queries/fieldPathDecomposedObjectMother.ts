import FieldPathDecomposed from "../../../../../src/domain/queries/fieldPathDecomposed";

function get(fieldPath: string) {
    return new FieldPathDecomposed(fieldPath);
}

export default {
    get
};