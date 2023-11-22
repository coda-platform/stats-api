import { DateTime } from "luxon";
import Breakdown from "../../../models/request/breakdown";
import Selector from "../../../models/request/selector";
import BreakdownResponse from "../../../models/response/breakdownResponse";
import QueryDataResults from "../../queries/queryDataResults";

function getBreakdownResultDateFormatted(breakdownResults: Array<any>) {
    const breakDownResultsByPeriodStart = new Map<string, number>();

    breakdownResults.forEach(countResult => {
        const periodStartFormatted = countResult.period_start;

        breakDownResultsByPeriodStart.set(periodStartFormatted, countResult.count_in_period);
    });

    return breakDownResultsByPeriodStart;
}

function getDateFromMiliseconds(miliseconds: number) {
    const dateToUtc = DateTime.fromMillis(miliseconds).toUTC();
    return dateToUtc;
}

function calculate(selector: Selector,
    queryDataResults: QueryDataResults,
    breakdown: Breakdown): BreakdownResponse {

    if (!breakdown) throw new Error('Must have breakdown to process');

    const breakdownQueryAndResults = queryDataResults.getSelectorBreakdownResult(selector);
    if(breakdownQueryAndResults instanceof Error){
        return {query: '', result: [], field: '', fieldType: '', error : breakdownQueryAndResults.message};
    }
    const breakdownResults = breakdownQueryAndResults.result as any[];
    const breakdownResultsDateFormatted = getBreakdownResultDateFormatted(breakdownResults);

    const breakdownSteps = new Array<{ periodStart: string, periodCount: number | null }>();

    const step = breakdown.slices.step * 1000; // Convert step in secounds
    const minStep = Math.floor(DateTime.fromISO(breakdown.slices.min).toMillis() / step) * step;
    const maxStep = Math.floor(DateTime.fromISO(breakdown.slices.max).toMillis() / step) * step;

    for (let stepIndex = minStep; stepIndex <= maxStep; stepIndex += step) {
        const stepDate = getDateFromMiliseconds(stepIndex).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

        const periodCount = breakdownResultsDateFormatted.get(stepDate) ?? 0;
        const periodCountProtectPrivacy = periodCount === null || periodCount <= 5 ? null : periodCount;

        const breakdownStep = {
            periodStart: stepDate,
            periodCount: periodCount
        };

        breakdownSteps.push(breakdownStep);
    }

    return { query: breakdownQueryAndResults.query, result: breakdownSteps, field: breakdown.resource.field, fieldType: breakdown.resource.fieldType };
}

export default {
    calculate
};