import { flattenConditionToFilters } from "../../../../../models/request/condition";
import Field from "../../../../../models/request/field";
import Selector from "../../../../../models/request/selector";
import CrossJoinFieldLevelBuilder from "./crossJoinFieldLevelBuilder";

export default class CrossJoinForLevelBuilder {
    fieldLevelBuilders: CrossJoinFieldLevelBuilder[];

    constructor(selector: Selector, field?: Field) {
        const uniqueFieldPaths = new Map<string, string>();

        if (field) {
            uniqueFieldPaths.set(field.path, field.label)
        }

        flattenConditionToFilters(selector.condition).forEach(filter =>
            uniqueFieldPaths.set(filter.path, filter.path));

        this.fieldLevelBuilders = new Array<CrossJoinFieldLevelBuilder>();
        for (let field of uniqueFieldPaths) {
            const fieldLevelBuilder = new CrossJoinFieldLevelBuilder(field);
            this.fieldLevelBuilders.push(fieldLevelBuilder);
        }
    }

    hasRemainingPathToBuild() {
        return this.fieldLevelBuilders.some(flb => flb.hasRemainingPathToBuild());
    }

    buildCurrentLevel() {
        const fieldLevelBuildersForLevel = this.fieldLevelBuilders.filter(flb => flb.hasRemainingPathToBuild());
        const fieldsInCrossJoinDistinct = new Set<string>(fieldLevelBuildersForLevel.map(flb => flb.buildCurrentLevel()));

        const fieldInCrossJoinArray = new Array<string>();
        for (let fieldInCrossJoin of fieldsInCrossJoinDistinct.values()) {
            fieldInCrossJoinArray.push(fieldInCrossJoin);
        }

        return `CROSS JOIN LATERAL ${fieldInCrossJoinArray.join(', ')}`;
    }
}