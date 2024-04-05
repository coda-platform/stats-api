import Selector from "../../../../../models/request/selector";
import queryStringEscaper from "../../../queryStringEscaper";
import FieldPathForLevelBuilder from "./fieldPathForLevelBuilder";
import JsonFieldValueForLevelBuilder from "./jsonFieldValueForLevelBuilder";

export default class CrossJoinFieldLevelBuilder {
    jsonFieldValueForLevelBuilder: JsonFieldValueForLevelBuilder;
    fieldPathForLevelBuilder: FieldPathForLevelBuilder;
    selector: Selector;

    constructor(field: [string, string], selector: Selector) {
        this.jsonFieldValueForLevelBuilder = new JsonFieldValueForLevelBuilder(field[0], selector);
        this.fieldPathForLevelBuilder = new FieldPathForLevelBuilder(field[1], selector);
        this.selector = selector;
    }

    hasRemainingPathToBuild(): any {
        return this.jsonFieldValueForLevelBuilder.hasRemainingPathToBuild();
    }

    buildCurrentLevel(): string {
        const jsonFieldValue = this.jsonFieldValueForLevelBuilder.buildCurrentLevel();
        const fieldPathFormatted = this.fieldPathForLevelBuilder.buildCurrentLevel();
        const selectorLabel = queryStringEscaper.escape(this.selector.label.toLowerCase());

        return `${jsonFieldValue} AS ${selectorLabel}_${fieldPathFormatted}`;
    }

}