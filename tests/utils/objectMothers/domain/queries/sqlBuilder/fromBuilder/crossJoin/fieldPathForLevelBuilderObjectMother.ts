import FieldPathForLevelBuilder from "../../../../../../../../src/domain/queries/sqlBuilder/fromBuilder/crossJoin/fieldPathForLevelBuilder";
import Selector from "../../../../../../../../src/models/request/selector";

function get(fieldPath: string, selector: Selector): FieldPathForLevelBuilder {
    return new FieldPathForLevelBuilder(fieldPath, selector);
}

export default {
    get
};