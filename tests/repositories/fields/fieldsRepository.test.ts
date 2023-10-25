import { when } from "jest-when";
import getFieldTypesQuery from "../../../src/domain/queries/fields/getFieldTypesQuery";
import aidboxProxy from "../../../src/infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../../src/models/fieldInfo";
import Field from "../../../src/models/request/field";
import filter from "../../../src/models/request/filter";
import Selector from "../../../src/models/request/selector";
import fieldsRepository from "../../../src/repositories/fields/fieldsRepository";
import fieldObjectMother from "../../utils/objectMothers/models/fieldObjectMother";
import summarizeRequestBodyObjectMother from "../../utils/objectMothers/models/request/summarizeRequestBodyObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";

describe('fieldsRepository tests', () => {
    const fieldA = fieldObjectMother.get('fieldA', 'fieldA');
    const fieldB = fieldObjectMother.get('fieldB', 'fieldB');
    const fieldC = fieldObjectMother.get('field.path.subPathC', 'fieldC');

    const patientSelector = selectorObjectMother.get('Patient', 'patient', [fieldA, fieldB], []);
    const observationSelector = selectorObjectMother.get('Observation', 'observation', [fieldC], []);

    const patientFieldsQuery = 'SELECT * FROM Patient';
    const observationFieldsQuery = 'SELECT * FROM Observation';

    const patientFieldsReponse = { age: 'FLOAT', fielda: 'TEXT', fieldb: 'FLOAT' }; // Lower case of field name important as postgres always lower cases column names.
    const observationFieldsReponse = { fieldc: 'DATE' }; // . in path is replace with _
    const observationFieldsNullTypeReponse = { fieldc: null }; // . in path is replace with _


    beforeEach(() => {
        getFieldTypesQuery.getQuery = jest.fn();
        const filterFields = new Map<filter, FieldInfo>();

        when(getFieldTypesQuery.getQuery as any)
            .calledWith(patientSelector, filterFields)
            .mockReturnValue(patientFieldsQuery)
            .calledWith(observationSelector, filterFields)
            .mockReturnValue(observationFieldsQuery);
    })

    it('aidboxProxy returns error, error is gotten for fields', async () => {
        // ARRANGE
        const summarizeRequest = summarizeRequestBodyObjectMother.get([patientSelector, observationSelector]);
        const filterFields = new Map<filter, FieldInfo>();

        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(patientFieldsQuery).mockReturnValue(Promise.reject(new Error('errorA')).catch((error)=> {return error}))
            .calledWith(observationFieldsQuery).mockReturnValue(Promise.reject(new Error('errorB')).catch((error)=> {return error}))

        // ACT
        const result = await fieldsRepository.getFieldsDataFromRequest(summarizeRequest, filterFields);

        // ASSERT
        expect(result.size).toEqual(3);
        expect(result.get(fieldA)).toEqual(new Error('errorA'));
        expect(result.get(fieldB)).toEqual(new Error('errorA'));
        expect(result.get(fieldC)).toEqual(new Error('errorB'));
    });

    it('with one selector two fields, responses are returned by field.', async () => {
        // ARRANGE
        const summarizeRequest = summarizeRequestBodyObjectMother.get([patientSelector]);
        const filterFields = new Map<filter, FieldInfo>();

        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(patientFieldsQuery).mockReturnValue([patientFieldsReponse]); // sql response is array.

        // ACT
        const result = await fieldsRepository.getFieldsDataFromRequest(summarizeRequest, filterFields);

        // ASSERT
        expect(result.size).toEqual(2);
        expect(result.get(fieldA)).toEqual(getFieldTypeReponse(patientSelector, fieldA, patientFieldsReponse.fielda));
        expect(result.get(fieldB)).toEqual(getFieldTypeReponse(patientSelector, fieldB, patientFieldsReponse.fieldb));
    });

    it('with two selectors, all selector fields responses are returned by field.', async () => {
        // ARRANGE
        const summarizeRequest = summarizeRequestBodyObjectMother.get([patientSelector, observationSelector]);
        const filterFields = new Map<filter, FieldInfo>();

        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(patientFieldsQuery).mockReturnValue([patientFieldsReponse])
            .calledWith(observationFieldsQuery).mockReturnValue([observationFieldsReponse]);

        // ACT
        const result = await fieldsRepository.getFieldsDataFromRequest(summarizeRequest, filterFields);

        // ASSERT
        expect(result.size).toEqual(3);
        expect(result.get(fieldA)).toEqual(getFieldTypeReponse(patientSelector, fieldA, patientFieldsReponse.fielda));
        expect(result.get(fieldB)).toEqual(getFieldTypeReponse(patientSelector, fieldB, patientFieldsReponse.fieldb));
        expect(result.get(fieldC)).toEqual(getFieldTypeReponse(observationSelector, fieldC, observationFieldsReponse.fieldc));
    });

    it('with one selector one field, two field types responsed returned, one null one date, date value is chosen.', async () => {
        // ARRANGE
        const summarizeRequest = summarizeRequestBodyObjectMother.get([observationSelector]);
        const filterFields = new Map<filter, FieldInfo>();

        when(getFieldTypesQuery.getQuery as any)
            .calledWith(observationSelector, filterFields)
            .mockReturnValue(observationFieldsQuery)
        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(observationFieldsQuery).mockReturnValue([observationFieldsNullTypeReponse, observationFieldsReponse]);

        // ACT
        const result = await fieldsRepository.getFieldsDataFromRequest(summarizeRequest, filterFields);

        // ASSERT
        expect(result.size).toEqual(1);
        expect(result.get(fieldC)).toEqual(getFieldTypeReponse(observationSelector, fieldC, observationFieldsReponse.fieldc));
    });

    it('with age field, predetermined from computed fields number response returned.', async () => {
        // ARRANGE
        const ageField = fieldObjectMother.get('age', 'age', 'integer');
        const selector = selectorObjectMother.get('Patient', 'patient', [ageField], []);
        const summarizeRequest = summarizeRequestBodyObjectMother.get([selector]);
        const filterFields = new Map<filter, FieldInfo>();

        when(getFieldTypesQuery.getQuery as any)
            .calledWith(selector, filterFields)
            .mockReturnValue(patientFieldsQuery)

        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(patientFieldsQuery).mockReturnValue([{age:"FLOAT"}]); // sql response is array.

        // ACT
        const result = await fieldsRepository.getFieldsDataFromRequest(summarizeRequest, filterFields);

        // ASSERT
        expect(result.size).toEqual(1);
        expect(result.get(ageField)).toEqual(getFieldTypeReponse(selector, ageField, 'FLOAT'));
    });

    it('with age field and another conventional field, responses are returned by field.', async () => {
        // ARRANGE
        const ageField = fieldObjectMother.get('age', 'age');
        const selector = selectorObjectMother.get('Patient', 'patient', [ageField, fieldA, fieldB], []);
        const summarizeRequest = summarizeRequestBodyObjectMother.get([selector]);
        const filterFields = new Map<filter, FieldInfo>();

        when(getFieldTypesQuery.getQuery as any)
            .calledWith(selector, filterFields)
            .mockReturnValue(patientFieldsQuery)

        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(patientFieldsQuery).mockReturnValue([patientFieldsReponse]); // sql response is array.

        // ACT
        const result = await fieldsRepository.getFieldsDataFromRequest(summarizeRequest, filterFields);

        // ASSERT
        expect(result.size).toEqual(3);

        expect(result.get(ageField)).toEqual(getFieldTypeReponse(selector, ageField, 'FLOAT'));
        expect(result.get(fieldA)).toEqual(getFieldTypeReponse(patientSelector, fieldA, patientFieldsReponse.fielda));
        expect(result.get(fieldB)).toEqual(getFieldTypeReponse(patientSelector, fieldB, patientFieldsReponse.fieldb));
    });
})

function getFieldTypeReponse(selector: Selector,
    fieldA: Field,
    type: string): FieldInfo {
    return {
        name: fieldA.label.toLocaleLowerCase(),
        type
    }
}