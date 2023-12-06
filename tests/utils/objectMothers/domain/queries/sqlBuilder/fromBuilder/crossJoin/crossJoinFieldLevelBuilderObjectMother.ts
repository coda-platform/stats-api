import CrossJoinFieldLevelBuilder from "../../../../../../../../src/domain/queries/sqlBuilder/fromBuilder/crossJoin/crossJoinFieldLevelBuilder";

function get(fieldPath: string, fieldLabel: string) {
    return new CrossJoinFieldLevelBuilder([fieldPath, fieldLabel]);
}

export default {
    get
};