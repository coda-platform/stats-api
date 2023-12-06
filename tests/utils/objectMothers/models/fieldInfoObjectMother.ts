import FieldInfo from "../../../../src/models/fieldInfo";

function get(type: string): FieldInfo {
    return {
        name: 'name',
        type
    };
}

export default {
    get
};