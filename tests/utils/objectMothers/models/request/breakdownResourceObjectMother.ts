import BreakdownResource from "../../../../../src/models/request/breakdownResource";

function get(type: string, field: string, fieldType: string): BreakdownResource {
    return {
        type,
        field,
        fieldType
    };
}

export default {
    get
};