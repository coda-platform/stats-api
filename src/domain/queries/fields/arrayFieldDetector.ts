import Condition, { flattenConditionToFilters, instanceOfCondition } from "../../../models/request/condition";
import resourceArrayFields from "../../resourceArrayFields";
import FieldPathDecomposed from "../fieldPathDecomposed";

function isArrayField(fieldPath: string) {
    const pathDecomposed = new FieldPathDecomposed(fieldPath);

    for (let pathElement of pathDecomposed) {
        if (resourceArrayFields.values.some(raf => raf === pathElement.path))
            return true;
    }

    return false;
}

function hasArrayFilters(condition: Condition): boolean{
    return flattenConditionToFilters(condition).some(f=> isArrayField(f.path))
}

function isArrayPathElement(fieldPath: string) { 
    return resourceArrayFields.values.some(raf => raf === fieldPath)
}

export default {
    isArrayField, hasArrayFilters, isArrayPathElement
}