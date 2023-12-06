import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import SummarizeResponse from "../../models/response/summarizeResponse";
import Selector from "../../models/request/selector";
import Measures from "../../models/request/measures";
import fieldReponseProcessor from "./fieldReponseProcessor";
import QueryDataResults from "../queries/queryDataResults";
import BreakdownResponse from "../../models/response/breakdownResponse";
import timeBreakdownCalculator from "./breakdown/timeBreakdownCalculator";
import FieldReponse from "../../models/response/fieldResponse";
import continuousBreakdownCalculator from "./breakdown/continuousBreakdownCalculator";
import Breakdown from "../../models/request/breakdown";

function getSummarizeReponse(selector: Selector,
    measures: Measures,
    queryDataResults: QueryDataResults,
    fieldTypes: Map<Field, FieldInfo>): SummarizeResponse {

    const countQueryAndResult = queryDataResults.getSelectorResult(selector);

    if (countQueryAndResult.result instanceof Error) {
        return { total: 0, error: countQueryAndResult.result.message, fieldResponses: [], query: countQueryAndResult.query };
    }

    const fieldResponses: FieldReponse[] = [];

    getJoinFieldResponse(selector, measures, queryDataResults, fieldTypes, fieldResponses, selector);

    const resultBeforeBreakdown = {
        total: countQueryAndResult.result.count,
        fieldResponses,
        query: countQueryAndResult.query
    };

    return resultBeforeBreakdown;
}

function getJoinFieldResponse(selector: Selector,
    measures: Measures,
    queryDataResults: QueryDataResults,
    fieldTypes: Map<Field, FieldInfo>,
    fieldResponses: FieldReponse[],
    topSelector: Selector) {

    if (selector.joins) {
        getJoinFieldResponse(selector.joins, measures, queryDataResults, fieldTypes, fieldResponses, topSelector);
    }

    selector.fields.map(f => {
        fieldResponses.push(fieldReponseProcessor.getFieldReponse(topSelector, f, measures, queryDataResults, fieldTypes));
    });
}

function getBreakdownReponse(selector: Selector, queryDataResults: QueryDataResults, breakdown: Breakdown) {

    if (breakdown.resource.fieldType==="dateTime") {
        const breakdownResult = timeBreakdownCalculator.calculate(selector, queryDataResults, breakdown);
        return breakdownResult;
    }
    else {
        const breakdownResult = continuousBreakdownCalculator.calculate(selector, queryDataResults, breakdown);
        return breakdownResult;
    }
}

export default {
    getSummarizeReponse, getBreakdownReponse
};