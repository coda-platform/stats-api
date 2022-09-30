import Breakdown from "../../../../../src/models/request/breakdown"
import breakdownResourceObjectMother from "./breakdownResourceObjectMother"
import breakdownSliceObjectMother from "./breakdownSliceObjectMother"

function get(type: string, field: string, step: number, query?: string): Breakdown {
    return {
        resource: breakdownResourceObjectMother.get(type, field),
        slices: breakdownSliceObjectMother.get(step),
        query
    }
}

function getWithMinMax(type: string, field: string, step: number, min: string, max: string, query?: string): Breakdown {
    return {
        resource: breakdownResourceObjectMother.get(type, field),
        slices: breakdownSliceObjectMother.get(step, min, max),
        query
    }
}

export default {
    get,
    getWithMinMax
}