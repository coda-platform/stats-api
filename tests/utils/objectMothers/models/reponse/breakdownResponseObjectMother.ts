import BreakdownResponse from "../../../../../src/models/response/breakdownResponse";

function get(): BreakdownResponse {
    return {
        query: 'SELECT * FROM PATIENT',
        result: [],
        field: 'Field',
        fieldType: ''
    };
}

export default {
    get
};