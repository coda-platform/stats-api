import GroupBySqlBuilder from "../../../../../../../src/domain/queries/sqlBuilder/groupByBuilder/groupBySqlBuilder";
import SqlBuilder from "../../../../../../../src/domain/queries/sqlBuilder/sqlBuilder";
import sqlBuilderObjectMother from "../../sqlBuilderObjectMother";

function get(sqlBuilder?: SqlBuilder) {
    sqlBuilder = sqlBuilder ?? sqlBuilderObjectMother.get();
    return new GroupBySqlBuilder(sqlBuilder);
}

export default {
    get
};