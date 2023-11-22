import FromSqlBuilder from "../../../../../../../src/domain/queries/sqlBuilder/fromBuilder/fromSqlBuilder";
import SqlBuilder from "../../../../../../../src/domain/queries/sqlBuilder/sqlBuilder";
import sqlBuilderObjectMother from "../../sqlBuilderObjectMother";

function get(sqlBuilder?: SqlBuilder) {
    sqlBuilder = sqlBuilder ?? sqlBuilderObjectMother.get();
    return new FromSqlBuilder(sqlBuilder);
}

export default {
    get
};