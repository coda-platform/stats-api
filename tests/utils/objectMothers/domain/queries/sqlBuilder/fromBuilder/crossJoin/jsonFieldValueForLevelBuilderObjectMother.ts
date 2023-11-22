import JsonFieldValueForLevelBuilder from "../../../../../../../../src/domain/queries/sqlBuilder/fromBuilder/crossJoin/jsonFieldValueForLevelBuilder";

function get(fieldPath: string) {
    return new JsonFieldValueForLevelBuilder(fieldPath);
}

export default {
    get
};