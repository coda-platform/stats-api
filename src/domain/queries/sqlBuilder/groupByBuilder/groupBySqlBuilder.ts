import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import SqlBuilder from "../sqlBuilder";
import groupByBuilder from "./groupByBuilder";
import groupByCompiledFieldBuilder from "./groupByCompiledFieldBuilder";
import groupByFieldBuilder from "./groupByFieldBuilder";

export default class GroupBySqlBuilder {

    sqlBuilder: SqlBuilder;

    constructor(sqlBuilder: SqlBuilder) {
        this.sqlBuilder = sqlBuilder;
        this.sqlBuilder.requestBuilders.push(groupByBuilder.build);
    }

    field(field: Field, selector: Selector): GroupBySqlBuilder {
        const builderFunction = (): string => groupByFieldBuilder.build(field, selector);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>): string {
        return this.sqlBuilder.build(selector, filterFieldTypes);
    }

    compiledField(compiledFieldName: string): GroupBySqlBuilder {
        const builderFunction = (): string => groupByCompiledFieldBuilder.build(compiledFieldName);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }
}