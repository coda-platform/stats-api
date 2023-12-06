import SelectSqlBuilder from "../../../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectSqlBuilder";
import SqlBuilder from "../../../../../../../src/domain/queries/sqlBuilder/sqlBuilder";
import sqlBuilderObjectMother from "../../sqlBuilderObjectMother";

function get(sqlBuilder?: SqlBuilder) {
    sqlBuilder = sqlBuilder ?? sqlBuilderObjectMother.get();
    return new SelectSqlBuilder(sqlBuilder);
}

export default {
    get
};