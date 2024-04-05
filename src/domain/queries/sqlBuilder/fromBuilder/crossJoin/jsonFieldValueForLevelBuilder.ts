import Selector from "../../../../../models/request/selector";
import resourceArrayFields from "../../../../resourceArrayFields";
import FieldPathDecomposed from "../../../fieldPathDecomposed";
import queryStringEscaper from "../../../queryStringEscaper";
import FieldPathForLevelBuilder from "./fieldPathForLevelBuilder";

export default class JsonFieldValueForLevelBuilder {
    pathDecomposed: FieldPathDecomposed;
    fieldPathForLevelBuilder: FieldPathForLevelBuilder;
    builtResourceConnector: boolean;
    selector: Selector;

    constructor(fieldPath: string, selector: Selector) {
        const pathEscaped = queryStringEscaper.escape(fieldPath);

        this.pathDecomposed = new FieldPathDecomposed(pathEscaped);
        this.selector = selector;
        this.fieldPathForLevelBuilder = new FieldPathForLevelBuilder(fieldPath, selector);
        this.builtResourceConnector = false;
    }

    hasRemainingPathToBuild(): any {
        const remainingPathElementsArray = this.pathDecomposed.toArray();
        const hasRemainingArrays = resourceArrayFields.get(this.selector).some(af => remainingPathElementsArray.some((pe: { path: string; }) => pe.path === af));
        return hasRemainingArrays;
    }

    buildPathToNextArray(currentPath: string): string {
        let currentPortionOfPath = currentPath;

        while (this.pathDecomposed.length > 0) {
            const currentElement = this.pathDecomposed.next().value;
            const currentPathElement = currentElement.pathElement;

            if (resourceArrayFields.get(this.selector).some(af => af === currentElement.path)) {
                currentPortionOfPath = `jsonb_array_elements(${currentPortionOfPath}->'${currentPathElement}')`;
                break;
            }

            currentPortionOfPath += `->'${currentPathElement}'`;
        }

        return currentPortionOfPath;
    }

    buildCurrentLevel(): string {
        if (!this.builtResourceConnector) {
            this.builtResourceConnector = true;
            return this.buildPathToNextArray('resource');
        }

        // stay one level before in field path for current level of json field value.
        const fieldPathFormattedForLevel = this.fieldPathForLevelBuilder.buildCurrentLevel();
        return this.buildPathToNextArray(fieldPathFormattedForLevel);
    }
}
