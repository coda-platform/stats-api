import Selector from "../../../../../models/request/selector";
import resourceArrayFields from "../../../../resourceArrayFields";
import FieldPathDecomposed from "../../../fieldPathDecomposed";
import queryStringEscaper from "../../../queryStringEscaper";

export default class FieldPathForLevelBuilder {
    pathDecomposed: FieldPathDecomposed;
    currentlyBuiltPath: string;
    selector: Selector;

    constructor(fieldPath: string, selector: Selector) {
        const pathEscaped = queryStringEscaper.escape(fieldPath);

        this.pathDecomposed = new FieldPathDecomposed(pathEscaped);
        this.selector = selector;
        this.currentlyBuiltPath = '';
    }

    hasRemainingPathToBuild(): any {
        const remainingPathElementsArray = this.pathDecomposed.toArray();
        const hasRemainingArrays = resourceArrayFields.get(this.selector).some(af => remainingPathElementsArray.some((pe: { path: string; }) => pe.path === af));
        return hasRemainingArrays;
    }

    buildCurrentLevel(): string {
        let currentPortionOfPath = '';

        while (this.pathDecomposed.length > 0) {
            const currentElement = this.pathDecomposed.next().value;
            const currentPathElement = currentElement.pathElement.toLowerCase();

            currentPortionOfPath = currentPortionOfPath.length > 0
                ? [currentPortionOfPath, currentPathElement].join('_')
                : currentPathElement;

            if (resourceArrayFields.get(this.selector).some(af => af === currentElement.path)) {
                break;
            }
        }

        this.currentlyBuiltPath = this.currentlyBuiltPath.length > 0
            ? [this.currentlyBuiltPath, currentPortionOfPath].join('_')
            : currentPortionOfPath;
        return this.currentlyBuiltPath;
    }
}