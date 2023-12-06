import continuousBreakdownQuery from "../../domain/queries/breakdown/continuousBreakdownQuery";
import timeBreakdownQuery from "../../domain/queries/breakdown/timeBreakdownQuery";
import QueryDataResults from "../../domain/queries/queryDataResults";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Breakdown from "../../models/request/breakdown";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";

async function executeBreakdownQuery(queryDataResults: QueryDataResults,
    selector: Selector,
    fieldTypes: Map<Field, FieldInfo>,
    filterTypes: Map<Filter, FieldInfo>,
    breakdown: Breakdown): Promise<void> {

    await getBreakdownResult(queryDataResults, selector, filterTypes, fieldTypes, breakdown);
}

async function getBreakdownResult(queryDataResults: QueryDataResults, selector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>, breakdown: Breakdown) {

    let breakdownQuery: string;
    if (breakdown.query) {
        breakdownQuery = breakdown.query;
    }
    else {
        breakdownQuery = breakdown.resource.fieldType === 'dateTime' ?
            timeBreakdownQuery.getQuery(selector, filterTypes, fieldTypes, breakdown) : continuousBreakdownQuery.getQuery(selector, filterTypes, fieldTypes, breakdown);
    }
    console.warn(breakdownQuery);
    const breakdownResult = await aidboxProxy.executeQuery(breakdownQuery) as any[];

    queryDataResults.addSelectorBreakdownResult(selector, { query: breakdownQuery, result: breakdownResult });

}

export default {
    executeBreakdownQuery
};