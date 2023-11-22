import FieldPathForLevelBuilder from "../../../../../../../../src/domain/queries/sqlBuilder/fromBuilder/crossJoin/fieldPathForLevelBuilder";

function get(fieldPath: string) {
    return new FieldPathForLevelBuilder(fieldPath);
}

export default {
    get
};