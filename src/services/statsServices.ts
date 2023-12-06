import dataReponseProcessor from "../domain/calculation/dataReponseProcessor";
import FieldInfo from "../models/fieldInfo";
import Field from "../models/request/field";
import Filter from "../models/request/filter";
import SummarizeRequestBody from "../models/request/summarizeRequestBody";
import SummarizeResponse from "../models/response/summarizeResponse";
import queryDataRepository from "../repositories/data/queryDataRepository";
import fieldsRepository from "../repositories/fields/fieldsRepository";
import filterFieldsRepository from "../repositories/fields/filterFieldsRepository";

async function getFieldTypeAndErrors(summarizeRequest: SummarizeRequestBody, filterFieldsNoErrors: Map<Filter, FieldInfo>) {
    const fields = await fieldsRepository.getFieldsDataFromRequest(summarizeRequest, filterFieldsNoErrors);

    const fieldRequestErrors = new Array<SummarizeResponse>();
    fields.forEach((value, key) => {
        if (value instanceof Error) {
            const errorFormatted: SummarizeResponse = { total: 0, error: value, fieldResponses: [], query: '' };
            fieldRequestErrors.push(errorFormatted);
        }
    });
    return { fieldRequestErrors, fields };
}

async function getFilterTypesAndErrors(summarizeRequest: SummarizeRequestBody) {
    const filterFields = await filterFieldsRepository.getFieldsDataFromRequest(summarizeRequest);

    const filterRequestErrors = new Array<SummarizeResponse>();
    filterFields.forEach((value, key) => {
        if (value instanceof Error) {
            const errorFormatted: SummarizeResponse = { total: 0, error: value, fieldResponses: [], query: '' };
            filterRequestErrors.push(errorFormatted);
        }
    });
    return { filterRequestErrors, filterFields };
}

async function getStats(summarizeRequest: SummarizeRequestBody) {
    try{
        const { filterRequestErrors, filterFields } = await getFilterTypesAndErrors(summarizeRequest);

        if (filterRequestErrors.length > 0) return filterRequestErrors;
        const filterFieldsNoErrors = new Map<Filter, FieldInfo>(filterFields as any);

        const { fieldRequestErrors, fields } = await getFieldTypeAndErrors(summarizeRequest, filterFieldsNoErrors);

        if (fieldRequestErrors.length > 0) return fieldRequestErrors;
        const fieldsNoErrors = new Map<Field, FieldInfo>(fields as any);
        const queryDataResults = await queryDataRepository.executeQueries(summarizeRequest, fieldsNoErrors, filterFieldsNoErrors);
        const response = dataReponseProcessor.getSummarizeReponses(summarizeRequest, queryDataResults, fieldsNoErrors);
        console.warn(response);
        return response;
    }
    catch(error){
        console.log(error);
        throw error;
    }

}

async function getBreakdown(summarizeRequest: SummarizeRequestBody) {
    const { filterRequestErrors, filterFields } = await getFilterTypesAndErrors(summarizeRequest);

    if (filterRequestErrors.length > 0) return filterRequestErrors;
    const filterFieldsNoErrors = new Map<Filter, FieldInfo>(filterFields as any);

    const { fieldRequestErrors, fields } = await getFieldTypeAndErrors(summarizeRequest, filterFieldsNoErrors);

    if (fieldRequestErrors.length > 0) return fieldRequestErrors;
    const fieldsNoErrors = new Map<Field, FieldInfo>(fields as any);
    const queryDataResults = await queryDataRepository.executeBreakdownQueries(summarizeRequest, fieldsNoErrors, filterFieldsNoErrors);
    const response = dataReponseProcessor.getBreakdownReponses(summarizeRequest, queryDataResults);

    console.warn(response);
    return response;
}

export default {
    getStats, getBreakdown
};