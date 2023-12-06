import FieldReponse from "../../../../../src/models/response/fieldResponse";

function get(field: string): FieldReponse {
    return {
        field,
        queries: [],
        count: 99
    };
}

export default {
    get
};