import FieldInfo from "../../../../../models/fieldInfo";
import Filter from "../../../../../models/request/filter";
import Selector from "../../../../../models/request/selector";
import SqlBuilder from "../../sqlBuilder";

function build(joinSelector: Selector, filterTypes: Map<Filter, FieldInfo>): string {
    const sqlBuilder = new SqlBuilder().select();

    if (hasFields(joinSelector)) {
        sqlBuilder.fieldsJson().comma();
    }

    if (!joinSelector?.condition ||
        !joinSelector.condition?.conditions ||
        joinSelector.condition?.conditions?.length === 0)
        return sqlBuilder.joinId().from().resourceTable().possibleFieldTypeJoin().build(joinSelector, filterTypes);

    const builderWithFilter = sqlBuilder.joinId().from().resourceTable().possibleFieldTypeJoin().where().fieldFilter();

    return builderWithFilter.build(joinSelector, filterTypes);
}

function hasFields(selector: Selector): boolean {
    if (selector.fields.length > 0)
        return true;
    else if (selector.joins)
        return hasFields(selector.joins);
    return false;
}

export default {
    build
};