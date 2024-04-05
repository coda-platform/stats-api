import { Queue } from "queue-typescript";
import { pathAndPathElement } from "./pathAndPathElement";

type nextPathAndPathElement = {
    value: pathAndPathElement;
    done: boolean;
};

export default class FieldPathDecomposed implements IterableIterator<pathAndPathElement> {
    pathAndPathElements: Queue<pathAndPathElement>;
    get length(): number {
        return this.pathAndPathElements.length;
    }

    constructor(fieldPath: string) {
        const fieldPathElements = fieldPath.split('.');
        const currentPathElements = new Array<string>();

        this.pathAndPathElements = new Queue<pathAndPathElement>();

        for (const pathElement of fieldPathElements) {
            currentPathElements.push(pathElement);

            const pathAndPathElement = {
                path: currentPathElements.join('.'),
                pathElement
            };

            this.pathAndPathElements.append(pathAndPathElement);
        }
    }

    next(): nextPathAndPathElement {
        const currentItemCount = this.pathAndPathElements.length;
        return { value: this.pathAndPathElements.dequeue(), done: currentItemCount === 0 };
    }

    [Symbol.iterator](): FieldPathDecomposed {
        return this;
    }

    toArray(): pathAndPathElement[] {
        return this.pathAndPathElements.toArray();
    }
}