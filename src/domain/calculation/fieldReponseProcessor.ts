import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Measures from "../../models/request/measures";
import Selector from "../../models/request/selector";
import FieldReponse from "../../models/response/fieldResponse";
import QueryDataResults from "../queries/queryDataResults";
import fieldMetricCalculatorsFactory from "./fieldMetricCalculatorsFactory";
import FieldReponseBuilder from "./fieldReponseBuilder";

function getFieldReponse(selector: Selector,
    field: Field,
    measures: Measures,
    queryDataResults: QueryDataResults,
    fieldTypes: Map<Field, FieldInfo>): FieldReponse {

    const fieldMetricCalculators = fieldMetricCalculatorsFactory.get(field, measures, fieldTypes);
    const fieldReponseBuilder = new FieldReponseBuilder(field, fieldMetricCalculators);

    return fieldReponseBuilder.build(selector, queryDataResults, fieldTypes);
}

export default {
    getFieldReponse
};