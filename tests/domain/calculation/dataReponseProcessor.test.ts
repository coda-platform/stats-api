import { when } from "jest-when";
import aidboxReponseProcessor from "../../../src/domain/calculation/dataReponseProcessor";
import summarizeReponseProcessor from "../../../src/domain/calculation/summarizeReponseProcessor";
import FieldInfo from "../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../src/models/request/conditionOperator";
import Field from "../../../src/models/request/field";
import queryDataResultsObjectMother from "../../utils/objectMothers/domain/queryDataResultsObjectMother";
import summarizeResponseObjectMother from "../../utils/objectMothers/models/reponse/summarizeResponseObjectMother";
import measuresObjectMother from "../../utils/objectMothers/models/request/measuresObjectMother";
import optionsObjectMother from "../../utils/objectMothers/models/request/optionsObjectMother";
import summarizeRequestBodyObjectMother from "../../utils/objectMothers/models/request/summarizeRequestBodyObjectMother";
import selectorObjectMother from "../../utils/objectMothers/models/selectorObjectMother";

describe('aidboxReponseProcessor tests', () => {
    const measures = measuresObjectMother.get();
    const options = optionsObjectMother.get(measures);
    const fieldsMap = new Map<Field, FieldInfo>();

    it('returns summarize responses from aidbox data', () => {
        // ARRANGE
        const queryDataResults = queryDataResultsObjectMother.get();

        const selectorA = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});
        const selectorB = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]});

        const summarizeRequest = summarizeRequestBodyObjectMother.get([selectorA, selectorB], options);

        const summarizeReponseA = summarizeResponseObjectMother.get();
        const summarizeReponseB = summarizeResponseObjectMother.get();

        summarizeReponseProcessor.getSummarizeReponse = jest.fn();
        when(summarizeReponseProcessor.getSummarizeReponse as any)
            .calledWith(selectorA, measures, queryDataResults, fieldsMap)
            .mockReturnValue(summarizeReponseA)
            .calledWith(selectorB, measures, queryDataResults, fieldsMap)
            .mockReturnValue(summarizeReponseB);

        // ACT
        const summarizeReponses = aidboxReponseProcessor.getSummarizeReponses(summarizeRequest, queryDataResults, fieldsMap);

        // ASSERT
        expect(summarizeReponses.length).toEqual(2);
        expect(summarizeReponses[0]).toBe(summarizeReponseA);
        expect(summarizeReponses[1]).toBe(summarizeReponseB);
    });
});