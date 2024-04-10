import FieldInfo from "../../../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import Filter from "../../../../../src/models/request/filter";
import whereSqlBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilder/whereBuilder/whereSqlBuilderObjectMother";
import fieldInfoObjectMother from "../../../../utils/objectMothers/models/fieldInfoObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('whereSqlBuilder tests', () => {
    const genderField = fieldObjectMother.get('gender', 'gender', 'string');
    const addressCityField = fieldObjectMother.get('address.city', 'city', 'string');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const stringFieldInfo = fieldInfoObjectMother.get('string');

    const patientSelector = selectorObjectMother.get('Patient', 'patient', [genderField, addressCityField], {conditionOperator:ConditionOperator.and, conditions:[femaleGenderFilter]});

    it('initialy has WHERE command', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = whereSqlBuilder.build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE");
    });

    it('can add fieldFilter to WHERE', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = whereSqlBuilder
            .fieldFilter()
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE (resource->>'gender')::string = 'female'");
    });

    it('can add fieldFilter with possible computed field WHERE', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();
        const ageField = fieldObjectMother.get('age', 'age', 'integer');

        // ACT
        const sqlQuery = whereSqlBuilder
            .fieldFilter(ageField)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE resource->>'birthDate' != 'null' AND (resource->>'gender')::string = 'female'");
    });

    it('can add subqueryFilter to WHERE', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = whereSqlBuilder
            .subqueryFilter('SQ')
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE SQ.gender = 'female'");
    });

    it('can add groupBy to WHERE', () => {
        // ARRANGE
        const filterTypes = getFieldsMap([femaleGenderFilter], [stringFieldInfo]);
        const whereSqlBuilder = whereSqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = whereSqlBuilder
            .fieldFilter()
            .groupBy()
            .field(genderField, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("WHERE (resource->>'gender')::string = 'female' GROUP BY resource->>'gender'");
    });

    function getFieldsMap(fields: Filter[], fieldInfo: FieldInfo[]) {
        const fieldsMap = new Map<Filter, FieldInfo>();

        for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
            fieldsMap.set(fields[fieldIndex], fieldInfo[fieldIndex]);
        }

        return fieldsMap;
    }
});