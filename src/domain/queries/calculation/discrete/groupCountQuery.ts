import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import SqlBuilder from "../../sqlBuilder/sqlBuilder";

function getQuery(selector: Selector, field: Field, filterFieldTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>): string {
    const queryToFromPart = new SqlBuilder()
        .select()
        .field(field)
        .comma()
        .countField(field, selector)
        .from()
        .resourceTable()
        .crossJoinForArrayFilters(field)
        .possibleJoin(fieldTypes);

    if (selector.condition.conditions.length === 0) {
        return queryToFromPart
            .groupBy()
            .field(field)
            .build(selector, filterFieldTypes);
    }

    return queryToFromPart
        .where()
        .fieldFilter()
        .groupBy()
        .field(field)
        .build(selector, filterFieldTypes);
}

export default {
    getQuery
}