import SummarizeResponse from "../../../../../src/models/response/summarizeResponse";

function get(): SummarizeResponse {
    return {
        total: 145,
        fieldResponses: [],
        query: 'Patient'
    };
}

export default {
    get
};