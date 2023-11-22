import CrossJoinForLevelBuilder from "../../../../../../../../src/domain/queries/sqlBuilder/fromBuilder/crossJoin/crossJoinForLevelBuilder";
import Field from "../../../../../../../../src/models/request/field";
import Selector from "../../../../../../../../src/models/request/selector";

function get(selector: Selector, field?: Field) {
    return new CrossJoinForLevelBuilder(selector, field);
}

export default {
    get
};