import whereSubqueryFilter from "../../../../../src/domain/queries/sqlBuilder/whereBuilder/whereSubqueryFilterBuilder";
import FieldInfo from "../../../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import Filter from "../../../../../src/models/request/filter";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('whereSubqueryFilterBuilder tests', () => {
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    it('with no field for filter, an error is thrown.', () => {
        // ARRANGE
        const filter = filterObjectMother.get('name', 'is', 'John', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        const filterFields = getFieldsMap([], []);

        // ACT/ASSERT
        expect(() => whereSubqueryFilter.build(selector, filterFields, 'SQ')).toThrowError();
    });

    it('with one filter, string field, filter with subquery name is set', () => {
        // ARRANGE
        const filter = filterObjectMother.get('name', 'is', 'John', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        const filterFields = getFieldsMap([filter], [stringFieldInfo]);

        // ACT
        const query = whereSubqueryFilter.build(selector, filterFields, 'SQ');

        // ASSERT
        expect(query).toEqual("SQ.name = 'John'");
    });

    it('with one filter, lower filter operator, < sql operand is used', () => {
        // ARRANGE
        const filter = filterObjectMother.get('name', 'lessThan', 'John', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        const filterFields = getFieldsMap([filter], [stringFieldInfo]);

        // ACT
        const query = whereSubqueryFilter.build(selector, filterFields, 'SQ');

        // ASSERT
        expect(query).toEqual("SQ.name < 'John'");
    });

    it('with one filter, filter path is composed, string field, filter path is normalized', () => {
        // ARRANGE
        const filter = filterObjectMother.get('address.city', 'is', 'Mexico', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        const filterFields = getFieldsMap([filter], [stringFieldInfo]);

        // ACT
        const query = whereSubqueryFilter.build(selector, filterFields, 'SQ');

        // ASSERT
        expect(query).toEqual("SQ.address_city = 'Mexico'");
    });

    it('with two filters, filters are concatenated with AND', () => {
        // ARRANGE
        const filterA = filterObjectMother.get('name', 'is', 'John', 'string');
        const filterB = filterObjectMother.get('gender', 'is', 'male', 'string');
        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filterA, filterB]});

        const filterFields = getFieldsMap([filterA, filterB], [stringFieldInfo, stringFieldInfo]);

        // ACT
        const query = whereSubqueryFilter.build(selector, filterFields, 'SQ');

        // ASSERT
        expect(query).toEqual("SQ.name = 'John' AND SQ.gender = 'male'");
    });

    function getFieldsMap(fields: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
});