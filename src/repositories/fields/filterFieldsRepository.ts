import FieldInfo from "../../models/fieldInfo";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import summarizeRequestBody from "../../models/request/summarizeRequestBody";
import fieldPathFormatter from "../../domain/queries/fieldPathFormatter";
import { flattenConditionToFilters } from "../../models/request/condition";
import { FlatAttributesByResourceType } from "../../../fhir-types";

const computedFields = new Map<string, string>();

computedFields.set('string', 'TEXT'); //set(jsonb_type, pg_type)
computedFields.set('number', 'FLOAT');
computedFields.set('integer', 'FLOAT');
computedFields.set('double precision', 'FLOAT');
computedFields.set('boolean', 'BOOLEAN');
computedFields.set('dateTime', 'timestamp');

function setFilterFieldTypes(condition: Filter[], response: any[], fieldsAndFieldReponses: Map<Filter, FieldInfo | Error>): void {
    for (const filter of condition) {
        if (response instanceof Error) fieldsAndFieldReponses.set(filter, response);
        else {
            const fieldPathNormalized = fieldPathFormatter.formatPath(filter.path);
            let fieldType = response.map(r => r[fieldPathNormalized]).filter(v => v !== undefined && v !== null)[0] as string;
            const computedField = computedFields.get(fieldType);
            if (computedField) fieldType = computedField;

            const fieldInfo: FieldInfo = {
                name: filter.path,
                type: String(fieldType)
            };
            fieldsAndFieldReponses.set(filter, fieldInfo);
        }
    }
}

function getFilterTypeFromFhirTypes(selector: Selector, filter: Filter): string {
    const selectorName = selector.resource;
    const filterName = filter.path;
    FlatAttributesByResourceType;
    const selectorFilters = FlatAttributesByResourceType[selectorName as keyof typeof FlatAttributesByResourceType];
    if (selectorFilters) {
        const foundFilter = selectorFilters.find(filter => filter.name === filterName);
        if (foundFilter)
            return foundFilter.type;
    }
    throw new Error(`no type found for Filter '${filterName}' for resource '${selector.resource}' as '${selector.label}'`);
}

async function getSelectorFieldInfos(selector: Selector, filterType: Map<Filter, FieldInfo | Error>): Promise<void> {
    if (selector?.condition && selector.condition?.conditions && selector.condition.conditions.length > 0) {
        const filters = flattenConditionToFilters(selector.condition);
        const selectorFilterTypes: any[] = [];
        filters.forEach(filter => {
            if (!filter.type) {
                filter.type = getFilterTypeFromFhirTypes(selector, filter);
            }
            const fieldPathNormalized = fieldPathFormatter.formatPath(filter.path);
            selectorFilterTypes.push({ [fieldPathNormalized]: filter.type });
        });
        setFilterFieldTypes(filters, selectorFilterTypes, filterType);
    }

    const joinSelector = selector.joins;
    if (!joinSelector) return;

    await getSelectorFieldInfos(joinSelector, filterType);
}

async function getFieldsDataFromRequest(summarizeRequest: summarizeRequestBody): Promise<Map<Filter, FieldInfo | Error>> {
    const fieldsAndFieldReponses = new Map<Filter, FieldInfo | Error>();

    for (let selectorIndex = 0; selectorIndex < summarizeRequest.selectors.length; selectorIndex++) {
        const selector = summarizeRequest.selectors[selectorIndex];
        await getSelectorFieldInfos(selector, fieldsAndFieldReponses);
    }

    return fieldsAndFieldReponses;
}

export default {
    getFieldsDataFromRequest
};