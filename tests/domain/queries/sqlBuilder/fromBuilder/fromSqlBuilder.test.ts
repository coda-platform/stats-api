import FieldInfo from "../../../../../src/models/fieldInfo";
import Filter from "../../../../../src/models/request/filter";
import fromSqlBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilder/fromBuilder/fromSqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";
import resourceArrayFields from "../../../../../src/domain/resourceArrayFields";
import Field from "../../../../../src/models/request/field";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";

describe('fromSqlBuilder tests', () => {
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const genderField = fieldObjectMother.get('gender', 'gender', 'string');
    const addressCityField = fieldObjectMother.get('address.city', 'address_city', 'string');

    const genderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const cityFilter = filterObjectMother.get('address.city', 'is', 'Quebec', 'string');

    const patientSelector = selectorObjectMother.get('Patient', 'patient', [genderField, addressCityField], {conditionOperator:ConditionOperator.and, conditions:[genderFilter]});

    it('initialy has FROM command', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = fromSqlBuilder.build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM");
    });

    it('can add resourceTable to FROM', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = fromSqlBuilder
            .resourceTable()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM Patient patient_table");
    });

    it('can add WHERE statement builder', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = fromSqlBuilder
            .resourceTable()
            .where()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM Patient patient_table WHERE");
    });

    // it('can add crossJoin to FROM', () => {
    //     // ARRANGE
    //     const selector = selectorObjectMother.get('Patient', 'patient', [genderField, addressCityField], {conditionOperator:ConditionOperator.and, conditions:[genderFilter, cityFilter]})
    //     const filterTypes = getFiltersMap([genderFilter, cityFilter], [stringFieldInfo, stringFieldInfo]);
    //     const fromSqlBuilder = fromSqlBuilderObjectMother.get();

    //     resourceArrayFields.values = ["address.city"];

    //     // ACT
    //     const sqlQuery = fromSqlBuilder
    //         .resourceTable()
    //         .build(selector, filterTypes);

    //     // ASSERT
    //     expect(sqlQuery).toEqual("FROM Patient patient_table CROSS JOIN LATERAL jsonb_array_elements(resource->'address'->'city') AS address_city");
    // })

    // it('can add crossJoin with field to FROM', () => {
    //     // ARRANGE
    //     const selector = selectorObjectMother.get('Patient', 'patient', [genderField, addressCityField], {conditionOperator:ConditionOperator.and, conditions:[genderFilter]})
    //     const filterTypes = getFiltersMap([genderFilter, cityFilter], [stringFieldInfo, stringFieldInfo]);
    //     const fromSqlBuilder = fromSqlBuilderObjectMother.get();

    //     resourceArrayFields.values = ["address.city"];

    //     // ACT
    //     const sqlQuery = fromSqlBuilder
    //         .resourceTable()
    //         .build(selector, filterTypes);

    //     // ASSERT
    //     expect(sqlQuery).toEqual("FROM Patient patient_table CROSS JOIN LATERAL jsonb_array_elements(resource->'address'->'city') AS address_city");
    // })

    it('can add subquery to FROM', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Patient', 'patient', [genderField], {conditionOperator:ConditionOperator.and, conditions:[]});
        const filterTypes = getFiltersMap([genderFilter, cityFilter], [stringFieldInfo, stringFieldInfo]);
        const fieldTypes = getFieldMap([genderField], [stringFieldInfo]);
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        resourceArrayFields.values = ["address.city"];

        // ACT
        const sqlQuery = fromSqlBuilder
            .subquery(fieldTypes)
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM (SELECT (resource->>'gender')::string AS gender FROM Patient patient_table ) as subQuery");
    });

    it('can add GROUP BY statement builder', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = fromSqlBuilder
            .resourceTable()
            .groupBy()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("FROM Patient patient_table GROUP BY");
    });

    it('can add possibleJoin statement builder', () => {
        // ARRANGE
        const joinSelector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[]});
        const innerJoinQuery = "SELECT id FROM Patient patient_table";
        const selector = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]}, joinSelector);

        const filterTypes = new Map<Filter, FieldInfo>();
        const fromSqlBuilder = fromSqlBuilderObjectMother.get();
        const fieldTypes = getFieldMap([],[]);

        // ACT
        const sqlQuery = fromSqlBuilder
            .possibleJoin(fieldTypes)
            .build(selector, filterTypes);

        // ASSERT
        // Space is for potential join in join.
        const expectedQuery = `FROM JOIN (${innerJoinQuery} ) patient_table ON observation_table.resource->'subject'->>'id' = patient_table.id`;
        expect(sqlQuery).toEqual(expectedQuery);
    });

    function getFiltersMap(filters: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < filters.length; fieldIndex++) {
            fieldsMap.set(filters[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }

    function getFieldMap(fields: Field[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Field, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
});