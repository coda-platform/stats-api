import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import arrayFieldDetector from "./fields/arrayFieldDetector";
import SqlBuilder from "./sqlBuilder/sqlBuilder";

// TODO: Can this be simplified since crossJoinForArrayFilters returns nothing if no array fields.
function getQuery(selector: Selector,
    filterTypes: Map<Filter, FieldInfo>,
    fieldTypes: Map<Field, FieldInfo>): string {

    const sqlBuilder = new SqlBuilder()
        .select()
        .countAll()
        .from()
        .resourceTable();

    if (selector.condition.conditions.length === 0) return sqlBuilder.possibleJoin(fieldTypes).build(selector, filterTypes);

    const hasArrayFilters = arrayFieldDetector.hasArrayFilters(selector.condition);

    const builderWithFilter = hasArrayFilters
        ? sqlBuilder.crossJoinForArrayFilters().possibleJoin(fieldTypes).where().fieldFilter()
        : sqlBuilder.possibleJoin(fieldTypes).where().fieldFilter();

    return builderWithFilter.build(selector, filterTypes);
}

export default {
    getQuery
}