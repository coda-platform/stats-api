import Field from "../../../../src/models/request/field";
import Selector from "../../../../src/models/request/selector";
import Condition from "../../../../src/models/request/condition";

function get(resource: string, label:string, fields: Field[], condition: Condition, joins?: Selector): Selector {
    return {
        resource,
        label,
        fields,
        condition,
        joins
    };
}

export default {
    get
};