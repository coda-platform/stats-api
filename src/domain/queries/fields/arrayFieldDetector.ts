import Condition, { flattenConditionToFilters } from "../../../models/request/condition";
import Selector from "../../../models/request/selector";
import resourceArrayFields from "../../resourceArrayFields";
import FieldPathDecomposed from "../fieldPathDecomposed";
import filterOperatorHelper from "../filters/filterOperatorHelper";

function isArrayField(fieldPath: string, selector: Selector): boolean {
    const pathDecomposed = new FieldPathDecomposed(fieldPath);

    for (const pathElement of pathDecomposed) {
        if (resourceArrayFields.get(selector).some(raf => raf === pathElement.path))
            return true;
    }

    return false;
}

function hasArrayField(selector: Selector): boolean {
    if(!selector.fields)
        return false;
    return selector.fields.some(f => isArrayField(f.path, selector))
}

function hasArrayFilters(selector: Selector): boolean {
    if (!selector.condition)
        return false;
    return flattenConditionToFilters(selector.condition).some(f => isArrayField(f.path, selector));
}

function hasArrayComparisonFilters(selector: Selector): boolean {
    if (!selector.condition)
        return false;
    const filters = flattenConditionToFilters(selector.condition);
    return filters.some(f => {
        return isArrayField(f.path, selector) && filterOperatorHelper.isComparisonOperator(f);
    });
}

function isArrayPathElement(fieldPath: string, selector: Selector): boolean {
    return resourceArrayFields.get(selector).some(raf => raf === fieldPath);
}

export default {
    isArrayField, hasArrayField, hasArrayFilters, isArrayPathElement, hasArrayComparisonFilters
};