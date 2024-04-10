import CrossJoinFieldLevelBuilder from "../../../../../../../../src/domain/queries/sqlBuilder/fromBuilder/crossJoin/crossJoinFieldLevelBuilder";
import Selector from "../../../../../../../../src/models/request/selector";

function get(fieldPath: string, fieldLabel: string, selector: Selector): CrossJoinFieldLevelBuilder {
    return new CrossJoinFieldLevelBuilder([fieldPath, fieldLabel], selector);
}

export default {
    get
};