import QueryDataResults from "../../domain/queries/queryDataResults";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import SummerizeRequestBody from "../../models/request/summarizeRequestBody";
import breakdownDataQueryExecutor from "./breakdownDataQueryExecutor";
import selectorsDataQueryExecutor from "./selectorsDataQueryExecutor";

async function executeQueries(summarizeRequest: SummerizeRequestBody,
    fieldTypes: Map<Field, FieldInfo>,
    filterTypes: Map<Filter, FieldInfo>): Promise<QueryDataResults> {

    const queryDataResults = new QueryDataResults();

    const measures = summarizeRequest.options.measures;

    // Use for instead of forEach for promise syncing
    for (let selectorIndex = 0; selectorIndex < summarizeRequest.selectors.length; selectorIndex++) {
        const selector = summarizeRequest.selectors[selectorIndex];
        await selectorsDataQueryExecutor.executeQueries(queryDataResults, selector, measures, fieldTypes, filterTypes);
    }

    return queryDataResults;
}

async function executeBreakdownQueries(summarizeRequest: SummerizeRequestBody,
    fieldTypes: Map<Field, FieldInfo>,
    filterTypes: Map<Filter, FieldInfo>): Promise<QueryDataResults> {

    const queryDataResults = new QueryDataResults();

    // Use for instead of forEach for promise syncing
    for (let selectorIndex = 0; selectorIndex < summarizeRequest.selectors.length; selectorIndex++) {
        const selector = summarizeRequest.selectors[selectorIndex];
        const breakdown = summarizeRequest.options.breakdown;
        if(breakdown){
            await breakdownDataQueryExecutor.executeBreakdownQuery(queryDataResults, selector, fieldTypes, filterTypes, breakdown);
        }
    }

    return queryDataResults;
}

export default {
    executeQueries, executeBreakdownQueries
};