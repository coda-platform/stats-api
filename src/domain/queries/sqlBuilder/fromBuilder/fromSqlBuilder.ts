import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import GroupBySqlBuilder from "../groupByBuilder/groupBySqlBuilder";
import SqlBuilder from "../sqlBuilder";
import WhereSqlBuilder from "../whereBuilder/whereSqlBuilder";
import fromBuilder from "./fromBuilder";
import fromCrossJoinBuilder from "./fromCrossJoinBuilder";
import fromResourceTableBuilder from "./fromResourceTableBuilder";
import fromSubqueryBuilder from "./fromSubqueryBuilder";
import fromPossibleFieldTypeJoinBuilder from "./join/fromPossibleFieldTypeJoinBuilder";
import fromPossibleJoinBuilder from "./join/fromPossibleJoinBuilder";

export default class FromSqlBuilder {
    sqlBuilder: SqlBuilder;

    constructor(sqlBuilder: SqlBuilder) {
        this.sqlBuilder = sqlBuilder;
        this.sqlBuilder.requestBuilders.push(fromBuilder.build);
    }

    resourceTable() {
        this.sqlBuilder.requestBuilders.push(fromResourceTableBuilder.build);
        return this;
    }

    crossJoinForArrayFilters(field?: Field) {
        const builderFunction = (selector: Selector) => fromCrossJoinBuilder.build(selector, field);

        this.sqlBuilder.requestBuilders.push(builderFunction);
        return this;
    }

    subquery(fieldTypes: Map<Field, FieldInfo>) {
        const builderFunction = (selector: Selector, filterTypes: Map<Filter, FieldInfo>) => fromSubqueryBuilder.build(selector, filterTypes, fieldTypes);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    possibleJoin(fieldTypes: Map<Field, FieldInfo>) {
        const builderFunction = (selector: Selector, filterTypes: Map<Filter, FieldInfo>) => fromPossibleJoinBuilder.build(selector, filterTypes, fieldTypes);
        this.sqlBuilder.requestBuilders.push(builderFunction);
        return this;
    }
    
    possibleFieldTypeJoin() {
        this.sqlBuilder.requestBuilders.push(fromPossibleFieldTypeJoinBuilder.build);
        return this;
    }

    where() {
        const whereSqlBuilder = new WhereSqlBuilder(this.sqlBuilder);
        return whereSqlBuilder;
    }

    groupBy() {
        const groupBySqlBuilder = new GroupBySqlBuilder(this.sqlBuilder);
        return groupBySqlBuilder;
    }

    build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>) {
        return this.sqlBuilder.build(selector, filterFieldTypes);
    }
}