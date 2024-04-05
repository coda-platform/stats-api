import FieldInfo from "../../../../../models/fieldInfo";
import Field from "../../../../../models/request/field";
import Filter from "../../../../../models/request/filter";
import Selector from "../../../../../models/request/selector";
import joinIdSelectors from "../../../../joinIdSelectors";
import arrayFieldDetector from "../../../fields/arrayFieldDetector";
import queryStringEscaper from "../../../queryStringEscaper";
import joinInnerQueryBuilder from "./joinInnerQueryBuilder";

function build(selector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>): string {
    // Example: `JOIN (${innerJoinQuery}) patient ON observation.resource->'subject'->>'id' = patient.id `
    if (!selector.joins) return '';

    const joinSelector = selector.joins;
    const innerQuery = joinInnerQueryBuilder.build(selector.joins, filterTypes, fieldTypes);
    const innerTableLabel = `${joinSelector.label.toLowerCase()}_table`;
    let outerTableLabel = `${selector.label.toLowerCase()}_table`;
    const selectorResource = queryStringEscaper.escape(selector.resource.toLowerCase());
    const joinResource = queryStringEscaper.escape(joinSelector.resource.toLowerCase());
    const hasArrayComparisonFilters = arrayFieldDetector.hasArrayComparisonFilters(selector);
    const isEncounterLocationJoin = selectorResource === "encounter" && joinResource === "location";
    let innerId:any, outerId:any;
    if(isEncounterLocationJoin){//only encounter->join->location use different keys to join
        innerId = outerId = joinIdSelectors.get(selector, selector.joins);
    }

    else{
        outerId = joinIdSelectors.get(selector);
        innerId = joinIdSelectors.get(selector.joins);
    }

    const resourceIdRetriever = outerId?.fromSelectorTableId;
    const joinId = innerId?.joinTableId;

    if(hasArrayComparisonFilters && isEncounterLocationJoin){
        outerTableLabel = `${selector.label.toLowerCase()}_location`;
    }

    const joinCrossJoin = innerId?.joinCrossJoin ? `${innerId?.joinCrossJoin}${outerTableLabel}.resource -> '${innerId?.joinCrossId}') as ${outerTableLabel}_${innerTableLabel}` : '';

    const joinBuilder = innerId?.joinCrossJoin && !hasArrayComparisonFilters ?
                        `${joinCrossJoin} JOIN (${innerQuery}) ${innerTableLabel} ON ${outerTableLabel}_${innerTableLabel}${resourceIdRetriever} = ${innerTableLabel}${joinId}`
                        :`JOIN (${innerQuery}) ${innerTableLabel} ON ${outerTableLabel}${resourceIdRetriever} = ${innerTableLabel}${joinId}`;
    return joinBuilder;
}

export default {
    build
};