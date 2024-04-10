import { when } from "jest-when";
import getFilterFieldTypesQuery from "../../../src/domain/queries/filters/getFilterFieldTypesQuery";
import aidboxProxy from "../../../src/infrastructure/aidbox/aidboxProxy";
import FieldInfo from "../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../src/models/request/conditionOperator";
import Filter from "../../../src/models/request/filter";
import Selector from "../../../src/models/request/selector";
import filterFieldsRepository from "../../../src/repositories/fields/filterFieldsRepository";
import filterObjectMother from "../../utils/objectMothers/models/filterObjectMother";
import summarizeRequestBodyObjectMother from "../../utils/objectMothers/models/request/summarizeRequestBodyObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";
import ConditionObjectMother from "../../utils/objectMothers/models/ConditionObjectMother";

describe('filterFieldsRepository tests', () => {
    const filterA = filterObjectMother.get('fieldA', 'is', 'value', 'string');
    const filterB = filterObjectMother.get('fieldB', 'is', 'value', 'integer');
    const filterC = filterObjectMother.get('field.path.subPathC', 'is', 'value', 'dateTime');

    const abCondition = ConditionObjectMother.get(ConditionOperator.and, [filterA, filterB]);
    const cCondition = ConditionObjectMother.get(ConditionOperator.and, [filterC]);

    const patientSelector = selectorObjectMother.get('Patient', 'patient', [], abCondition);
    const observationSelector = selectorObjectMother.get('Observation', 'observation', [], cCondition);

    const patientFieldsQuery = 'SELECT * FROM Patient';
    const observationFieldsQuery = 'SELECT * FROM Observation';

    const patientFieldsReponse = { fielda: 'TEXT', fieldb: 'FLOAT' }; // Lower case of field name important as postgres always lower cases column names.
    const observationFieldsReponse = { field_path_subpathc: 'timestamp' }; // . in path is replace with _
    const observationFieldsNullTypeReponse = { field_path_subpathc: null }; // . in path is replace with _

    beforeEach(() => {
        getFilterFieldTypesQuery.getQuery = jest.fn();

        when(getFilterFieldTypesQuery.getQuery as any)
            .calledWith(patientSelector)
            .mockReturnValue(patientFieldsQuery)
            .calledWith(observationSelector)
            .mockReturnValue(observationFieldsQuery);
    });

    it('with one selector two fields, responses are returned by field.', async () => {
        // ARRANGE
        const summarizeRequest = summarizeRequestBodyObjectMother.get([patientSelector]);

        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(patientFieldsQuery).mockReturnValue([patientFieldsReponse]); // sql response is array.

        // ACT
        const result = await filterFieldsRepository.getFieldsDataFromRequest(summarizeRequest);

        // ASSERT
        expect(result.size).toEqual(2);
        expect(result.get(filterA)).toEqual(getFitlerTypeReponse(patientSelector, filterA, patientFieldsReponse.fielda));
        expect(result.get(filterB)).toEqual(getFitlerTypeReponse(patientSelector, filterB, patientFieldsReponse.fieldb));
    });

    it('with two selectors, all selector fields responses are returned by field.', async () => {
        // ARRANGE
        const summarizeRequest = summarizeRequestBodyObjectMother.get([patientSelector, observationSelector]);

        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(patientFieldsQuery).mockReturnValue([patientFieldsReponse])
            .calledWith(observationFieldsQuery).mockReturnValue([observationFieldsReponse]);

        // ACT
        const result = await filterFieldsRepository.getFieldsDataFromRequest(summarizeRequest);

        // ASSERT
        expect(result.size).toEqual(3);
        expect(result.get(filterA)).toEqual(getFitlerTypeReponse(patientSelector, filterA, patientFieldsReponse.fielda));
        expect(result.get(filterB)).toEqual(getFitlerTypeReponse(patientSelector, filterB, patientFieldsReponse.fieldb));
        expect(result.get(filterC)).toEqual(getFitlerTypeReponse(observationSelector, filterC, observationFieldsReponse.field_path_subpathc));
    });

    it('with one selector one filter, two field types responsed returned, one null one date, date value is chosen.', async () => {
        // ARRANGE
        const summarizeRequest = summarizeRequestBodyObjectMother.get([observationSelector]);

        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(observationFieldsQuery).mockReturnValue([observationFieldsNullTypeReponse, observationFieldsReponse]);

        // ACT
        const result = await filterFieldsRepository.getFieldsDataFromRequest(summarizeRequest);

        // ASSERT
        expect(result.size).toEqual(1);
        expect(result.get(filterC)).toEqual(getFitlerTypeReponse(observationSelector, filterC, observationFieldsReponse.field_path_subpathc));
    });


    it('with one selector, selector is join with two fields, responses are returned by field.', async () => {
        // ARRANGE
        const topSelector = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]}, patientSelector);
        const summarizeRequest = summarizeRequestBodyObjectMother.get([topSelector]);

        when(getFilterFieldTypesQuery.getQuery as any)
            .calledWith(patientSelector)
            .mockReturnValue(patientFieldsQuery)
            .calledWith(topSelector)
            .mockReturnValue(observationFieldsQuery);

        aidboxProxy.executeQuery = jest.fn();
        when(aidboxProxy.executeQuery as any)
            .calledWith(observationFieldsQuery).mockReturnValue([])
            .calledWith(patientFieldsQuery).mockReturnValue([patientFieldsReponse]); // sql response is array.

        // ACT
        const result = await filterFieldsRepository.getFieldsDataFromRequest(summarizeRequest);

        // ASSERT
        expect(result.size).toEqual(2);
        expect(result.get(filterA)).toEqual(getFitlerTypeReponse(patientSelector, filterA, patientFieldsReponse.fielda));
        expect(result.get(filterB)).toEqual(getFitlerTypeReponse(patientSelector, filterB, patientFieldsReponse.fieldb));
    });

    function getFitlerTypeReponse(selector: Selector,
        filter: Filter,
        type: string): FieldInfo {
        return {
            name: filter.path,
            type
        };
    }
});