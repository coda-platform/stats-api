import countResourceQuery from "../../domain/queries/countResourceQuery";
import QueryDataResults from "../../domain/queries/queryDataResults";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Measures from "../../models/request/measures";
import Selector from "../../models/request/selector";
import fieldsDataQueryExecutor from "./fieldsDataQueryExecutor";
import fieldsMeasureDataQueryExecutor from "./fieldsMeasureDataQueryExecutor";

async function executeQueries(queryDataResults: QueryDataResults,
    selector: Selector,
    measures: Measures,
    fieldTypes: Map<Field, FieldInfo>,
    filterTypes: Map<Filter, FieldInfo>): Promise<void> {

    await getTotalCount(queryDataResults, selector, filterTypes, fieldTypes);

    await getFieldsDataQueryExecutor(queryDataResults, selector, measures, fieldTypes, filterTypes, selector);
}

async function getTotalCount(queryDataResults: QueryDataResults, selector: Selector, filterTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>) {
    const countQuery = countResourceQuery.getQuery(selector, filterTypes, fieldTypes);
    console.warn(countQuery);

    const countResult = await aidboxProxy.executeQuery(countQuery) as any[];
    if(countResult instanceof Error){
        queryDataResults.addSelectorResult(selector, { query: countQuery, result: countResult});
    }
    else{
        queryDataResults.addSelectorResult(selector, { query: countQuery, result: countResult[0] });
    }
    return queryDataResults;
}

async function getFieldsDataQueryExecutor(
    queryDataResults: QueryDataResults,
    selector: Selector,
    measures: Measures,
    fieldTypes: Map<Field, FieldInfo>,
    filterTypes: Map<Filter, FieldInfo>,
    topSelector: Selector) {

    if (selector.joins) {
        await getFieldsDataQueryExecutor(queryDataResults, selector.joins, measures, fieldTypes, filterTypes, topSelector);
    }

    for (let fieldIndex = 0; fieldIndex < selector.fields.length; fieldIndex++) {
        const field = selector.fields[fieldIndex];
            const fieldType = fieldTypes.get(field);
            if (!fieldType) throw new Error('No associated field type.');
            await fieldsMeasureDataQueryExecutor.executeQuery(queryDataResults, field, measures, fieldTypes, filterTypes, topSelector);
    }

}

export default {
    executeQueries
};