import { when } from "jest-when";
import getFieldTypesQuery from "../../../../src/domain/queries/fields/getFieldTypesQuery";
import FieldInfo from "../../../../src/models/fieldInfo";
import Filter from "../../../../src/models/request/filter";
import sqlBuilderObjectMother from "../../../utils/objectMothers/domain/queries/sqlBuilderObjectMother";
import fieldObjectMother from "../../../utils/objectMothers/models/fieldObjectMother";
import selectorObjectMother from "../../../utils/objectMothers/models/selectorObjectMother";

describe('getFieldTypesQuery tests', () => {
    const fieldA = fieldObjectMother.get('fieldA');
    const fieldB = fieldObjectMother.get('fieldB');

    const filterTypes = new Map<Filter, FieldInfo>();

    it('gets field types from selector resource', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', [fieldA, fieldB], []);

        // ACT
        const query = getFieldTypesQuery.getQuery(selector, filterTypes);

        // ASSERT
        expect(query).toEqual(sqlBuilderObjectMother.get()
            .select()
            .distinct()
            .fieldTypes()
            .from()
            .resourceTable()
            .build(selector, filterTypes))
    })

    it('escapes resource to avoid sql injections', () => {
        // ARRANGE
        const selector = selectorObjectMother.get("Patient'--drop", [fieldA, fieldB], []);

        // ACT
        const query = getFieldTypesQuery.getQuery(selector, filterTypes);

        // ASSERT
        expect(query).toEqual("SELECT DISTINCT jsonb_typeof(resource->'fieldA') AS fielda, jsonb_typeof(resource->'fieldB') AS fieldb FROM Patient patient_table")
    })
})