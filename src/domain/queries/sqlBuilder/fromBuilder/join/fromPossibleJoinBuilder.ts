import FieldInfo from "../../../../../models/fieldInfo";
import Field from "../../../../../models/request/field";
import Filter from "../../../../../models/request/filter";
import Selector from "../../../../../models/request/selector";
import joinIdSelectors from "../../../../joinIdSelectors";
import joinInnerQueryBuilder from "./joinInnerQueryBuilder";

function build(selector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>) {
    // Example: `JOIN (${innerJoinQuery}) patient ON observation.resource->'subject'->>'id' = patient.id `
    if (!selector.joins) return '';

    const joinSelector = selector.joins;
    const innerQuery = joinInnerQueryBuilder.build(selector, selector.joins, filterTypes, fieldTypes);
    const innerTableQueryName = `${joinSelector.label.toLowerCase()}_table`;
    const outerTableQueryName = `${selector.label.toLowerCase()}_table`;
    const joinIdSelector = joinIdSelectors.get(selector, selector.joins);
    const resourceIdRetriever = joinIdSelector?.fromSelectorTableId;
    const joinId = joinIdSelector?.joinTableId;
    const joinCrossJoin = joinIdSelector?.joinCrossJoin ? ` ${joinIdSelector?.joinCrossJoin}${outerTableQueryName}.resource -> '${joinIdSelector?.joinCrossId}') AS ${outerTableQueryName}_${innerTableQueryName} ` : '';
    const joinBuilder = joinIdSelector?.joinCrossJoin ? 
    `JOIN (${innerQuery}) ${innerTableQueryName}${joinCrossJoin} ON ${outerTableQueryName}_${innerTableQueryName}${resourceIdRetriever} = ${innerTableQueryName}${joinId}` : 
    `JOIN (${innerQuery}) ${innerTableQueryName}${joinCrossJoin} ON ${outerTableQueryName}${resourceIdRetriever} = ${innerTableQueryName}${joinId}`;
    return joinBuilder
}

export default {
    build
}