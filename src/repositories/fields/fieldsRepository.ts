import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Filter from "../../models/request/filter";
import Selector from "../../models/request/selector";
import fieldLabelFormatter from "../../domain/queries/fieldLabelFormatter";
import { FlatAttributesByResourceType } from "../../../fhir-types";
import SummarizeRequestBody from "../../models/request/summarizeRequestBody";

const computedFields = new Map<string, string>();

computedFields.set('string', 'TEXT'); //set(jsonb_type, pg_type)
computedFields.set('number', 'FLOAT');
computedFields.set('integer', 'FLOAT');
computedFields.set('double precision', 'FLOAT');
computedFields.set('boolean', 'BOOLEAN');
computedFields.set('dateTime', 'timestamp');

async function getFieldInfo(selector: Selector, fieldsAndFieldReponses: Map<Field, FieldInfo | Error>, filterFieldsNoErrors: Map<Filter, FieldInfo>): Promise<void> {
    if (selector.fields.length > 0) {
        const selectorFieldTypes: any[] = [];
        selector.fields.forEach(field => {
            if (!field.type) {
                field.type = getFieldTypeFromFhirTypes(selector, field);
            }
            const fieldLabelNormalized = fieldLabelFormatter.formatLabel(field.label);
            selectorFieldTypes.push({ [fieldLabelNormalized]: field.type });
        });

        getFieldReponsesFromData(selector, selectorFieldTypes, fieldsAndFieldReponses);
    }

    const joinSelector = selector.joins;
    if (!joinSelector) return;

    await getFieldInfo(joinSelector, fieldsAndFieldReponses, filterFieldsNoErrors);
}

function getFieldTypeFromFhirTypes(selector: Selector, field: Field): string {
    const selectorName = selector.resource;
    const fieldName = field.path;
    FlatAttributesByResourceType;
    const selectorFields = FlatAttributesByResourceType[selectorName as keyof typeof FlatAttributesByResourceType];
    if (selectorFields) {
        const foundField = selectorFields.find(field => field.name === fieldName);
        if (foundField)
            return foundField.type;
    }
    throw new Error(`no type found for Field '${fieldName}' for resource '${selector.resource}' as '${selector.label}'`);
}

function getFieldReponsesFromData(selector: Selector, data: any[], fieldsAndFieldReponses: Map<Field, FieldInfo | Error>): Map<Field, FieldInfo | Error> {
    selector.fields.forEach((field) => {
        if (data instanceof Error) {
            fieldsAndFieldReponses.set(field, data);
            return;
        }

        const fieldLabelNormalized = fieldLabelFormatter.formatLabel(field.label);
        const fieldType = data.map(r => r[fieldLabelNormalized]).filter(v => v !== undefined && v !== null)[0] as string;
        let compiledFieldType = computedFields.get(fieldType);
        if (!compiledFieldType) {
            compiledFieldType = fieldType;
        }
        const fieldInfo: FieldInfo = {
            name: fieldLabelNormalized,
            type: String(compiledFieldType)
        };
        fieldsAndFieldReponses.set(field, fieldInfo);
    });
    return fieldsAndFieldReponses;
}

async function getFieldsDataFromRequest(summarizeRequest: SummarizeRequestBody, filterFieldsNoErrors: Map<Filter, FieldInfo>): Promise<Map<Field, FieldInfo | Error>> {
    const fieldsAndFieldReponses = new Map<Field, FieldInfo | Error>();

    for (let selectorIndex = 0; selectorIndex < summarizeRequest.selectors.length; selectorIndex++) {
        const selector = summarizeRequest.selectors[selectorIndex];
        await getFieldInfo(selector, fieldsAndFieldReponses, filterFieldsNoErrors);
    }

    return fieldsAndFieldReponses;
}

export default {
    getFieldsDataFromRequest
};