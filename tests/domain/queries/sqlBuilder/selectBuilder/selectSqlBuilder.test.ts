import FieldInfo from "../../../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import Field from "../../../../../src/models/request/field";
import Filter from "../../../../../src/models/request/filter";
import selectBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilder/selectBuilder/selectSqlBuilderObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import breakdownObjectMother from "../../../../utils/objectMothers/models/request/breakdownObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('SelectSqlBuilder tests', () => {
    const genderField = fieldObjectMother.get('gender', 'gender', 'string');
    const addressCityField = fieldObjectMother.get('address.city', 'city', 'string');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');

    const patientSelector = selectorObjectMother.get('Patient', 'patient', [genderField, addressCityField], {conditionOperator:ConditionOperator.and, conditions:[femaleGenderFilter]});
    const observationSelector = selectorObjectMother.get('Observation', 'observation', [genderField, addressCityField], {conditionOperator:ConditionOperator.and, conditions:[femaleGenderFilter]});

    it('initialy has SELECT command', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder.build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT");
    });

    it('can add distinct to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .distinct()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT DISTINCT");
    });

    it('can add join id to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .joinId()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT id");
    });

    it('can add fieldTypes to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        const selector = selectorObjectMother.get('Patient', 'patient', [field], {conditionOperator:ConditionOperator.and, conditions:[]});

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldTypes()
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT jsonb_typeof(resource->'gender') AS gender");
    });

    it('can add filterTypes to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const filter = filterObjectMother.get('gender', 'is', 'male', 'string');

        const selector = selectorObjectMother.get('Patient', 'patient', [], {conditionOperator:ConditionOperator.and, conditions:[filter]});

        // ACT
        const sqlQuery = selectSqlBuilder
            .filterTypes()
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT jsonb_typeof(resource->'gender') AS gender");
    });

    it('can add countAll to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .countAll()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(*)");
    });

    it('can add field to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const sqlQuery = selectSqlBuilder
            .field(field)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT resource->>'gender' AS gender");
    });

    it('can add subqueryField to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const sqlQuery = selectSqlBuilder
            .subqueryField(field, 'SQ')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT SQ.gender");
    });

    it('can add countField to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const sqlQuery = selectSqlBuilder
            .countField(field, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(resource->>'gender')");
    });

    it('can add countSubqueryField to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const sqlQuery = selectSqlBuilder
            .countSubqueryField(field, 'SQ')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(SQ.gender)");
    });

    it('can add fieldSum to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fieldTypes = new Map<Field, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender' ,'string');

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldSum(field, fieldTypes, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT SUM(resource->>'gender') AS sum");
    });

    it('can add fieldMean to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fieldTypes = new Map<Field, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldMean(field, fieldTypes, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT AVG(resource->>'gender') AS mean");
    });

    it('can add fieldStdDev to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const fieldTypes = new Map<Field, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldStdDev(field, fieldTypes, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT STDDEV(resource->>'gender') AS stddev");
    });

    it('can add fieldCiLow to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');
        const fieldTypes = new Map<Field, FieldInfo>();


        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldCiLow(field, fieldTypes, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT percentile_disc(0.05) within group (order by resource->>'gender') AS ci_low");
    });

    it('can add fieldCiHigh to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');
        const fieldTypes = new Map<Field, FieldInfo>();

        // ACT
        const sqlQuery = selectSqlBuilder
            .fieldCiHigh(field, fieldTypes, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT percentile_disc(0.95) within group (order by resource->>'gender') AS ci_high");
    });

    it('can add namedCountAll to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .namedCountAll('count_in_period')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(*) AS count_in_period");
    });

    it('can add comma to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const sqlQuery = selectSqlBuilder
            .countAll()
            .comma()
            .countSubqueryField(field, 'SQ')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(*) , count(SQ.gender)");
    });

    it('can add breakdownPeriodStart to SELECT', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        const breakdown = breakdownObjectMother.get('Observation', 'issued', 1209600, 'dateTime');
        const selector = selectorObjectMother.get('Observation', 'observation', [], {conditionOperator:ConditionOperator.and, conditions:[]}, undefined);

        const queryPattern = (fieldCompiled: string, step: number) => {
            return `SELECT to_timestamp(floor((extract('epoch' from (${fieldCompiled})::timestamp) / ${step} )) * ${step}) AS period_start`;
        };

        // ACT
        const sqlQuery = selectSqlBuilder
            .breakdownPeriodStart(breakdown.slices.step, 'fieldLabel')
            .build(selector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual(queryPattern("fieldLabel", 1209600));
    });

    it('can add FROM statement builder', () => {
        // ARRANGE
        const filterTypes = new Map<Filter, FieldInfo>();
        const selectSqlBuilder = selectBuilderObjectMother.get();

        // ACT
        const sqlQuery = selectSqlBuilder
            .countAll()
            .from()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("SELECT count(*) FROM");
    });
});