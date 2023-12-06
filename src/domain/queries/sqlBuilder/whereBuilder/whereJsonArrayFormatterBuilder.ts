import resourceArrayFields from "../../../resourceArrayFields";
import FieldPathDecomposed from "../../fieldPathDecomposed";
import arrayFieldDetector from "../../fields/arrayFieldDetector";
import indexArrayFieldDetector from "../../fields/indexArrayFieldDetector";
import jsonFieldValuePathCompiler from "../../jsonFieldValuePathCompiler";
import { pathAndPathElement } from "../../pathAndPathElement";
import queryStringEscaper from "../../queryStringEscaper";

export default class WhereJsonArrayFormatterBuilder {
    pathEscaped: string;
    pathDecomposed: FieldPathDecomposed;
    selectorLabel: string;

    constructor(fieldPath: string, selectorLabel:string) {
        this.pathEscaped = queryStringEscaper.escape(fieldPath);
        this.pathDecomposed = new FieldPathDecomposed(this.pathEscaped);
        this.selectorLabel = queryStringEscaper.escape(selectorLabel);
    }

    getElementsToLastArray() {
        let elementsToNextArray = new Array<pathAndPathElement>();
        const potentialElementsToNextArray = new Array<pathAndPathElement>();

        const pathAndPathElements = this.pathDecomposed.toArray();

        for (let elementIndex = 0; elementIndex < pathAndPathElements.length; elementIndex++) {
            const pathElement = pathAndPathElements[elementIndex];
            potentialElementsToNextArray.push(pathElement);

            if (resourceArrayFields.values.some(af => af === pathElement.path)) {
                elementsToNextArray = new Array(...potentialElementsToNextArray);
            }
        }

        return elementsToNextArray;
    }

    getPathFromElements() {
        let pathFromElements = '';

        for (const pathElement of this.pathDecomposed) {

            if (this.pathDecomposed.length === 0) {
                pathFromElements += `->>'${pathElement.pathElement}'`;
                continue;
            }

            pathFromElements += `->'${pathElement.pathElement}'`;
        }

        return pathFromElements;
    }

    build() {
        const isArrayField = arrayFieldDetector.isArrayField(this.pathEscaped);
        if (isArrayField) {
            return jsonFieldValuePathCompiler.getPathCompiled(this.pathEscaped, this.selectorLabel, true);
        }
        return  jsonFieldValuePathCompiler.getPathCompiled(this.pathEscaped, this.selectorLabel, true);
    }
}