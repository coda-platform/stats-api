import FieldInfo from "../../../../../models/fieldInfo";
import Field from "../../../../../models/request/field";
import Filter from "../../../../../models/request/filter";
import Selector from "../../../../../models/request/selector";
import SqlBuilder from "../../sqlBuilder";

function build(joinSelector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>) {
    const sqlBuilder = new SqlBuilder()
        .select()

    if (hasFields(joinSelector)) {
        sqlBuilder.fields().comma();
    }

    if (!joinSelector.condition || joinSelector.condition.conditions.length === 0) {
        return sqlBuilder.joinId().from().resourceTable().possibleJoin(fieldTypes).build(joinSelector, filterTypes);
    }

    const builderWithFilter = sqlBuilder.joinId().from().resourceTable().possibleJoin(fieldTypes).where().fieldFilter();

    return builderWithFilter.build(joinSelector, filterTypes);
}

function hasFields(selector: Selector): boolean {
    if (selector.fields.length > 0)
        return true
    else if (selector.joins)
        return hasFields(selector.joins)
    return false
}

export default {
    build
}