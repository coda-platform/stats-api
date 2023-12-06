import selectJoinIdBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectJoinIdBuilder";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('selectJoinIdBuilder tests', () => {
    const testParams = [
        { resource: 'Observation', joinResource: "Patient", selectId: "resource->'subject'->>'id' AS subject_id" },
        { resource: 'Patient', joinResource: "Observation", selectId: "id" },
    ];

    for (const testParam of testParams) {
        it(`returns ${testParam.selectId} for resource ${testParam.joinResource}`, () => {
            const joinSelector = selectorObjectMother.get(testParam.joinResource, 'label', [], {conditionOperator:ConditionOperator.and, conditions:[]});
            const selector = selectorObjectMother.get(testParam.resource, 'label', [], {conditionOperator:ConditionOperator.and, conditions:[]}, joinSelector);

            expect(selectJoinIdBuilder.build(selector)).toEqual(testParam.selectId);
        });
    }

    it(`escapes sql injection`, () => {
        const joinSelector = selectorObjectMother.get("Patient'--drop", 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});
        const selector = selectorObjectMother.get("Observation'--drop", 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]});

        expect(selectJoinIdBuilder.build(joinSelector)).toEqual("id");
    });
});