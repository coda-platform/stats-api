import whereFieldFilterBuilder from "../../../../../src/domain/queries/sqlBuilder/whereBuilder/whereFieldFilterBuilder";
import FieldInfo from "../../../../../src/models/fieldInfo";
import Filter from "../../../../../src/models/request/filter";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";

describe('whereFieldFilterBuilder tests', () => {
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    beforeEach(() => {
        resourceArrayFields.values = []; // Ignore convention array fields to simplify tests.
    })

    it('with no field info for filter, an error is thrown', () => {
        const filter = filterObjectMother.get('name', 'is', 'John', 'string');
        const filterFields = getFieldsMap([], []);
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        expect(() => whereFieldFilterBuilder.build(selector, filterFields)).toThrowError();
    })

    it('uses field path for query', () => {
        // ARRANGE
        const filter = filterObjectMother.get('name', 'is', 'John', 'string');
        const filterFields = getFieldsMap([filter], [stringFieldInfo]);
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        // ACT
        const query = whereFieldFilterBuilder.build(selector, filterFields);

        // ASSERT
        expect(query).toEqual("(resource->>'name')::string = 'John'");
    })

    it('uses filter operator to figure out which sql operand to use', () => {
        // ARRANGE
        const filter = filterObjectMother.get('name', 'lessThan', 'John', 'string');
        const filterFields = getFieldsMap([filter], [stringFieldInfo]);
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        // ACT
        const query = whereFieldFilterBuilder.build(selector, filterFields);

        // ASSERT
        expect(query).toEqual("(resource->>'name')::string < 'John'");
    })

    it('compiles level field path with appropriate sql connector', () => {
        // ARRANGE
        const filter = filterObjectMother.get('address.country', 'is', 'Mexico', 'string')
        const filterFields = getFieldsMap([filter], [stringFieldInfo]);
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        // ACT
        const query = whereFieldFilterBuilder.build(selector, filterFields);

        // ASSERT
        expect(query).toEqual("(resource->'address'->>'country')::string = 'Mexico'");
    })

    it('when array element in path, first path element of field, uses standard nomenclature combined with field element', () => {
        // ARRANGE
        const filter = filterObjectMother.get('address.country', 'is', 'Mexico', 'string')
        const filterFields = getFieldsMap([filter], [stringFieldInfo]);
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        resourceArrayFields.values = ['address'];

        // ACT
        const query = whereFieldFilterBuilder.build(selector, filterFields);

        // ASSERT
        expect(query).toEqual("(address->>'country')::string = 'Mexico'");
    })

    it('when array element in path, second path element of field, uses standard nomenclature combined with field element', () => {
        // ARRANGE
        const filter = filterObjectMother.get('address.country.name', 'is', 'Mexico', 'string')
        const filterFields = getFieldsMap([filter], [stringFieldInfo]);
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        resourceArrayFields.values = ['address.country']

        // ACT
        const query = whereFieldFilterBuilder.build(selector, filterFields);

        // ASSERT
        expect(query).toEqual("(address_country->>'name')::string = 'Mexico'");
    })

    it('with two filters, and combined filter returned', () => {
        // ARRANGE
        const filterA = filterObjectMother.get('filterA', 'is', 'valueA', 'type');
        const filterB = filterObjectMother.get('filterB', 'is', 'valueB', 'type');
        const filterFields = getFieldsMap([filterA, filterB], [stringFieldInfo, stringFieldInfo]);

        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filterA, filterB]});

        // ACT
        const query = whereFieldFilterBuilder.build(selector, filterFields);

        // ASSERT
        expect(query).toEqual("(resource->>'filterA')::string = 'valueA' AND (resource->>'filterB')::string = 'valueB'");
    })

    it('with age possible computed field, has appropriate filter to avoir nulls', () => {
        // ARRANGE
        const filter = filterObjectMother.get('name', 'is', 'John', 'string');
        const filterFields = getFieldsMap([filter], [stringFieldInfo]);

        const ageField = fieldObjectMother.get('age', 'age', 'integer');
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        // ACT
        const query = whereFieldFilterBuilder.build(selector, filterFields, ageField);

        // ASSERT
        expect(query).toEqual("(resource->>'name')::string = 'John' AND resource->>'birthDate' != 'null'");
    })

    function getFieldsMap(fields: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
})