import SqlBuilder from "../../../../../../../src/domain/queries/sqlBuilder/sqlBuilder";
import WhereSqlBuilder from "../../../../../../../src/domain/queries/sqlBuilder/whereBuilder/whereSqlBuilder";
import sqlBuilderObjectMother from "../../sqlBuilderObjectMother";

function get(sqlBuilder?: SqlBuilder) {
    sqlBuilder = sqlBuilder ?? sqlBuilderObjectMother.get();
    return new WhereSqlBuilder(sqlBuilder);
}

export default {
    get
};