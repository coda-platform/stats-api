import fromJoinBuilder from "../../../../../../src/domain/queries/sqlBuilder/fromBuilder/join/fromPossibleJoinBuilder";
import environnementProvider from "../../../../../../src/infrastructure/environnementProvider";
import FieldInfo from "../../../../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../../../../src/models/request/conditionOperator";
import Field from "../../../../../../src/models/request/field";
import Filter from "../../../../../../src/models/request/filter";
import selectorObjectMother from "../../../../../utils/objectMothers/models/selectorObjectMother";

describe('fromPossibleJoinBuilder tests', () => {
    const patientJoinSelector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});
    const observationJoinSelector = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]});


    it('with no join selector, returns empty query', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Observation', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});
        const filterMap = new Map<Filter, FieldInfo>();
        const fieldMap = new Map<Field, FieldInfo>();

        // ACT
        const query = fromJoinBuilder.build(selector, filterMap, fieldMap);

        // ASSERT
        expect(query).toEqual('');
    });

    const patientInnerJoinQuery = "SELECT id FROM Patient patient_table";
    const observationInnerJoinQuery = "SELECT resource->'subject'->>'id' AS subject_id FROM Observation observation_table";

    beforeEach(() => {
        environnementProvider.isLocal = jest.fn().mockReturnValue(false);
    });

    it('add join statement from joinSelector to selector, join patient to observation', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]}, patientJoinSelector);
        const filterMap = new Map<Filter, FieldInfo>();
        const fieldMap = new Map<Field, FieldInfo>();

        // ACT
        const query = fromJoinBuilder.build(selector, filterMap, fieldMap);

        // ASSERT
        const expectedQuery = `JOIN (${patientInnerJoinQuery} ) patient_table ON observation_table.resource->'subject'->>'id' = patient_table.id`;
        expect(query).toEqual(expectedQuery);
    });

    it('add join statement from joinSelector to selector, join observation to patient', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]}, observationJoinSelector);
        const filterMap = new Map<Filter, FieldInfo>();
        const fieldMap = new Map<Field, FieldInfo>();

        // ACT
        const query = fromJoinBuilder.build(selector, filterMap, fieldMap);

        // ASSERT
        const expectedQuery = `JOIN (${observationInnerJoinQuery} ) observation_table ON patient_table.id = observation_table.subject_id`;
        expect(query).toEqual(expectedQuery);
    });

});