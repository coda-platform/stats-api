import { flattenConditionToFilters } from "../../../../../models/request/condition";
import Field from "../../../../../models/request/field";
import Selector from "../../../../../models/request/selector";
import CrossJoinFieldLevelBuilder from "./crossJoinFieldLevelBuilder";

export default class CrossJoinForLevelBuilder {
    fieldLevelBuilders: CrossJoinFieldLevelBuilder[];
    selector: Selector;

    constructor(selector: Selector, field?: Field) {
        const uniqueFieldPaths = new Map<string, string>();
        this.selector = selector;

        if (field) {
            uniqueFieldPaths.set(field.path, field.label);
        }

        flattenConditionToFilters(selector.condition).forEach(filter =>
            uniqueFieldPaths.set(filter.path, filter.path));

        this.fieldLevelBuilders = new Array<CrossJoinFieldLevelBuilder>();
        for (const field of uniqueFieldPaths) {
            const fieldLevelBuilder = new CrossJoinFieldLevelBuilder(field, this.selector);
            this.fieldLevelBuilders.push(fieldLevelBuilder);
        }
    }

    hasRemainingPathToBuild(): boolean {
        return this.fieldLevelBuilders.some(flb => flb.hasRemainingPathToBuild());
    }

    buildCurrentLevel(): string {
        const fieldLevelBuildersForLevel = this.fieldLevelBuilders.filter(flb => flb.hasRemainingPathToBuild());
        const fieldsInCrossJoinDistinct = new Set<string>(fieldLevelBuildersForLevel.map(flb => flb.buildCurrentLevel()));

        const fieldInCrossJoinArray = new Array<string>();
        for (const fieldInCrossJoin of fieldsInCrossJoinDistinct.values()) {
            fieldInCrossJoinArray.push(fieldInCrossJoin);
        }

        return `CROSS JOIN LATERAL ${fieldInCrossJoinArray.join(', ')}`;
    }
}