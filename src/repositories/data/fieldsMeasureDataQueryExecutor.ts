import contants from "../../constants";
import continuousQuery from "../../domain/queries/calculation/continuous/continuousQuery";
import groupCountQuery from "../../domain/queries/calculation/discrete/groupCountQuery";
import dateCountQuery from "../../domain/queries/calculation/discrete/dateCountQuery";
import QueryDataResults from "../../domain/queries/queryDataResults";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Selector from "../../models/request/selector";
import Filter from "../../models/request/filter";
import Measures from "../../models/request/measures";

const measureTypeQuery = new Map<string, { getQuery: (selector: Selector, field: Field, filterFieldTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>, measures: Measures) => string }>();
measureTypeQuery.set("continuous", continuousQuery);
measureTypeQuery.set("categorical", groupCountQuery);
measureTypeQuery.set("dateTime", dateCountQuery);


async function executeQuery(queryDataResults: QueryDataResults,
    field: Field,
    measures: Measures,
    fieldTypes: Map<Field, FieldInfo>,
    filterFieldTypes: Map<Filter, FieldInfo>,
    topSelector: Selector): Promise<void> {

    const fieldType = fieldTypes.get(field);
    if (!fieldType) throw new Error('No matching field type for field');

    const isContinousMeasure = contants.numericalTypes.some(nt => nt === fieldType.type);
    const isDateTimeMeasure = fieldType.type === "DATE";
    const queryBuilder = isContinousMeasure
        ? measureTypeQuery.get("continuous")
        : isDateTimeMeasure
            ? measureTypeQuery.get("dateTime")
            : measureTypeQuery.get("categorical");

    if (!queryBuilder) throw new Error('Not a valid measure');
    const query = queryBuilder.getQuery(topSelector, field, filterFieldTypes, fieldTypes, measures);

    console.warn(query);

    const queryResult = await aidboxProxy.executeQuery(query);
    mapResultsbyMeasure(queryDataResults, topSelector, field, measures, isContinousMeasure, queryResult, query);

}

function mapResultsbyMeasure(queryDataResults: QueryDataResults,
    selector: Selector,
    field: Field,
    measures: Measures,
    isContinousMeasure: boolean,
    queryResult: any,
    query: string) {
    if (isContinousMeasure) {
        for (let measureIndex = 0; measureIndex < measures.continuous.length; measureIndex++) {
            const measure = measures.continuous[measureIndex];
            let fieldResult = {};
            if(queryResult instanceof Error){
                queryDataResults.addResult(selector, field, measure, {
                    query,
                    result: queryResult
                });
                continue;
            }
            switch (measure) {
                case 'count':
                    fieldResult = { sum: queryResult[0].sum };
                    break;
                case 'mean':
                    fieldResult = { count: queryResult[0].count, mean: queryResult[0].mean };
                    break;
                case 'stdev':
                    fieldResult = { stddev: queryResult[0].stddev };
                    break;
                case 'ci95':
                    fieldResult = { ci_low: queryResult[0].ci_low, ci_high: queryResult[0].ci_high };
            }

            queryDataResults.addResult(selector, field, measure, {
                query,
                result: [fieldResult]
            });
        }
    }
    else {
        for (let measureIndex = 0; measureIndex < measures.categorical.length; measureIndex++) {
            const measure = measures.categorical[measureIndex];

            queryDataResults.addResult(selector, field, measure, {
                query,
                result: queryResult
            });
        }
    }
}

export default {
    executeQuery
};