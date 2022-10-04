import fieldPathFormatter from "../../domain/queries/fieldPathFormatter";
import getFilterFieldTypesQuery from "../../domain/queries/filters/getFilterFieldTypesQuery";
import aidboxProxy from "../../infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../models/fieldInfo";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import SummarizeRequestBody from "../../models/request/summarizeRequestBody";

const computedFields = new Map<string, string>();

computedFields.set('string', 'TEXT'); //set(jsonb_type, pg_type)
computedFields.set('number', 'FLOAT');
computedFields.set('integer', 'FLOAT');
computedFields.set('double precision', 'FLOAT');
computedFields.set('boolean', 'BOOLEAN');
computedFields.set('dateTime', 'DATE');

function setFilterFieldTypes(filters: Filter[], response: any[], fieldsAndFieldReponses: Map<Filter, FieldInfo | Error>) {
    for (let filter of filters) {
        const fieldPathNormalized = fieldPathFormatter.formatPath(filter.path);
        let fieldType = response.map(r => r[fieldPathNormalized]).filter(v => v != null)[0] as string;
        const computedField = computedFields.get(fieldType)
        if (computedField)
            fieldType = computedField

        const fieldInfo: FieldInfo = {
            name: filter.path,
            type: String(fieldType)
        };

        fieldsAndFieldReponses.set(filter, fieldInfo);
    }
}

async function getSelectorFieldInfos(selector: Selector, filterType: Map<Filter, FieldInfo | Error>) {
    try {
        if (selector.filters.length > 0) {
            var filterTypesInSelector: boolean = true;
            selector.filters.filter(filter => {
                if (!filter.type)
                    filterTypesInSelector = false
            })

            if (filterTypesInSelector) {
                var selectorFilterTypes: any[] = [];
                selector.filters.forEach(filter => {
                    const fieldPathNormalized = fieldPathFormatter.formatPath(filter.path);
                    selectorFilterTypes.push({ [fieldPathNormalized]: filter.type })
                })
                setFilterFieldTypes(selector.filters, selectorFilterTypes, filterType);
            }
            else {
                const query = getFilterFieldTypesQuery.getQuery(selector);
                const selectorFilterTypes = await aidboxProxy.executeQuery(query);
                setFilterFieldTypes(selector.filters, selectorFilterTypes, filterType);
            }
        }

        const joinSelector = selector.joins;
        if (!joinSelector) return;

        await getSelectorFieldInfos(joinSelector, filterType);
    }
    catch (error) {
        for (let filter of selector.filters) {
            filterType.set(filter, error as any);
        }
    }
}

async function getFieldsDataFromRequest(summarizeRequest: SummarizeRequestBody): Promise<Map<Filter, FieldInfo | Error>> {
    const fieldsAndFieldReponses = new Map<Filter, FieldInfo | Error>();

    for (let selectorIndex = 0; selectorIndex < summarizeRequest.selectors.length; selectorIndex++) {
        const selector = summarizeRequest.selectors[selectorIndex];
        await getSelectorFieldInfos(selector, fieldsAndFieldReponses);
    }

    return fieldsAndFieldReponses;
}

export default {
    getFieldsDataFromRequest
}