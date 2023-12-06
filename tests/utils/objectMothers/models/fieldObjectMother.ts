import Field from "../../../../src/models/request/field";

function get(path: string, label:string, type?:string): Field {
    return {
        path,
        label,
        type
    };
}

export default {
    get
};