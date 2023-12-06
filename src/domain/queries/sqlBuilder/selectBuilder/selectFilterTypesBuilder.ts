import { flattenConditionToFilters } from "../../../../models/request/condition";
import Selector from "../../../../models/request/selector";
import getFilterTypeSelectQuery from "../../fields/getFilterTypeSelectQuery";

function build(selector: Selector) {
    return flattenConditionToFilters(selector.condition)
        .map(f => getFilterTypeSelectQuery.getQuery(f.path))
        .join(', ');
}

export default {
    build
};