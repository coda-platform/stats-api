import getFilterFieldTypesQuery from "../../../../src/domain/queries/filters/getFilterFieldTypesQuery";
import FieldInfo from "../../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../../src/models/request/conditionOperator";
import Filter from "../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import filterObjectMother from "../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('getFilterFieldTypesQuery tests', () => {
    const filterA = filterObjectMother.get('fieldA', 'is', 'value', 'type');
    const filterB = filterObjectMother.get('fieldB', 'is', 'value', 'type');

    const filterTypes = new Map<Filter, FieldInfo>();

    it('gets query with field queries and resource from', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filterA, filterB]});

        // ACT
        const query = getFilterFieldTypesQuery.getQuery(selector);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .distinct()
            .filterTypes()
            .from()
            .resourceTable()
            .build(selector, filterTypes));
    });

    it('escapes resource to avoid sql injections', () => {
        // ARRANGE
        const selector = selectorObjectMother.get("Patient'--drop", 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filterA, filterB]});

        // ACT
        const query = getFilterFieldTypesQuery.getQuery(selector);

        // ASSERT
        expect(query).toEqual("SELECT DISTINCT jsonb_typeof(resource->'fieldA') AS fielda, jsonb_typeof(resource->'fieldB') AS fieldb FROM Patient patient_table");
    });
});