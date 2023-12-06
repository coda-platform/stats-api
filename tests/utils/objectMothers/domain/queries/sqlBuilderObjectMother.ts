import SqlBuilder from "../../../../../src/domain/queries/sqlBuilder/sqlBuilder";

function get() {
    return new SqlBuilder();
}

export default {
    get
};