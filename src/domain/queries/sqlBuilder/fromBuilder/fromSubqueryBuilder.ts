import Field from "../../../../models/request/field";
import Selector from "../../../../models/request/selector";
import SqlBuilder from "../sqlBuilder";
import Filter from "../../../../models/request/filter";
import FieldInfo from "../../../../models/fieldInfo";
import arrayFieldDetector from "../../fields/arrayFieldDetector";

function build(selector: Selector,
    filterTypes: Map<Filter, FieldInfo>,
    fieldTypes: Map<Field, FieldInfo>): string {

    const sqlBuilder = new SqlBuilder()
        .select()
        .castedFields(selector, fieldTypes)
        .from()
        .resourceTable();

        if (!selector?.condition || !selector.condition?.conditions || selector.condition?.conditions?.length === 0) 
            return `(${sqlBuilder.possibleJoin(fieldTypes).build(selector, filterTypes)}) as subQuery`;
    
    const hasArrayComparisonFilters = arrayFieldDetector.hasArrayComparisonFilters(selector);

    const builderWithFilter = hasArrayComparisonFilters ?
        sqlBuilder.crossJoinForArrayFilters().possibleJoin(fieldTypes).where().fieldFilter()
        : sqlBuilder.possibleJoin(fieldTypes).where().fieldFilter();

    const subquery = builderWithFilter.build(selector, filterTypes);
    return `(${subquery}) as subQuery`;
}

export default {
    build
};