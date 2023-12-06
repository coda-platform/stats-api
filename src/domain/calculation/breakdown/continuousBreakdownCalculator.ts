import Breakdown from "../../../models/request/breakdown";
import Selector from "../../../models/request/selector";
import BreakdownResponse from "../../../models/response/breakdownResponse";
import QueryDataResults from "../../queries/queryDataResults";


function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    breakdown: Breakdown): BreakdownResponse {

    if (!breakdown) throw new Error('Must have breakdown to process');

    const breakdownQueryAndResults = queryDataResults.getSelectorBreakdownResult(selector);
    if(breakdownQueryAndResults instanceof Error){
        return {query: '', result: [], field: '', fieldType: '', error : breakdownQueryAndResults.message};
    }
    const breakdownResults = breakdownQueryAndResults.result as any[];

    const breakdownSteps = new Array<{ periodStart: string, periodCount: number | null }>();

    let step = breakdown.slices.step;
    const min = parseFloat(breakdown.slices.min);
    const max = parseFloat(breakdown.slices.max);
    if((max-min) / step > 100){ //limit amount of breakdown steps
        step = (max-min) / 100;
    }
    for(let i = min; i+step <= max; i+=step){//manually assign 0 to steps with no results from DB
        const periodStart = i;
        let bdResult = breakdownResults.find(el => {return parseFloat(el.breakdown) === periodStart;});
        if(!bdResult){
            bdResult = {count: 0};
        }
        const breakdownStep = {
            periodStart: String(periodStart),
            periodCount: bdResult.count
        };

        breakdownSteps.push(breakdownStep);
    }


    return { query: breakdownQueryAndResults.query, result: breakdownSteps, field: breakdown.resource.field, fieldType: breakdown.resource.fieldType };
}

export default {
    calculate
};