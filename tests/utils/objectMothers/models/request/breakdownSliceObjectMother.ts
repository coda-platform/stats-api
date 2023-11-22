import BreakdownSlices from "../../../../../src/models/request/breadkdownSlices";

function get(step: number, min?: string, max?: string): BreakdownSlices {
    min = min ?? '2014-1-1';
    max = max ?? '2014-1-2';

    return {
        step,
        min,
        max
    };
}

export default {
    get
};