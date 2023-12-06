import constants from "../../constants";
import QueryDataResults from "../../domain/queries/queryDataResults";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Measures from "../../models/request/measures";
import Selector from "../../models/request/selector";
import fieldsMeasureDataQueryExecutor from "./fieldsMeasureDataQueryExecutor";

async function executeQueries(queryDataResults: QueryDataResults,
    selector: Selector,
    measures: Measures,
    field: Field,
    fieldTypes: Map<Field, FieldInfo>,
    filterFieldTypes: Map<Filter, FieldInfo>): Promise<void> {

    const fieldType = fieldTypes.get(field);
    if (!fieldType) throw new Error('No associated field type.');
    await fieldsMeasureDataQueryExecutor.executeQuery(queryDataResults, field, measures, fieldTypes, filterFieldTypes, selector);
}

export default {
    executeQueries
};


