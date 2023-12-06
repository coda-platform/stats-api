import Filter from "../../../../src/models/request/filter";

function get(path: string, operator: string, value: string, type?:string): Filter {
    return {
        path,
        operator,
        value,
        type
    };
}

export default {
    get
};