import JsonFieldValueForLevelBuilder from "../../../../../../../../src/domain/queries/sqlBuilder/fromBuilder/crossJoin/jsonFieldValueForLevelBuilder";
import Selector from "../../../../../../../../src/models/request/selector";

function get(fieldPath: string, selector: Selector): JsonFieldValueForLevelBuilder {
    return new JsonFieldValueForLevelBuilder(fieldPath, selector);
}

export default {
    get
};