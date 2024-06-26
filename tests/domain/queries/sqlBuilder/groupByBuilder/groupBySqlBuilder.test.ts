import FieldInfo from "../../../../../src/models/fieldInfo";
import { ConditionOperator } from "../../../../../src/models/request/conditionOperator";
import Filter from "../../../../../src/models/request/filter";
import groupBySqlBuilderObjectMother from "../../../../utils/objectMothers/domain/queries/sqlBuilder/groupByBuilder/groupBySqlBuilderObjectMother";
import ConditionObjectMother from "../../../../utils/objectMothers/models/ConditionObjectMother";
import fieldObjectMother from "../../../../utils/objectMothers/models/fieldObjectMother";
import filterObjectMother from "../../../../utils/objectMothers/models/filterObjectMother";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother";

describe('groupBySqlBuilder tests', () => {
    const genderField = fieldObjectMother.get('gender', 'gender', 'string');
    const addressCityField = fieldObjectMother.get('address.city', 'city', 'string');

    const femaleGenderFilter = filterObjectMother.get('gender', 'is', 'female', 'string');
    const femaleGenderCondition = ConditionObjectMother.get(ConditionOperator.and, [femaleGenderFilter]);
    const filterTypes = new Map<Filter, FieldInfo>();

    const patientSelector = selectorObjectMother.get('Patient', 'patient', [genderField, addressCityField], femaleGenderCondition);

    it('initialy has WHERE command', () => {
        // ARRANGE
        const groupByBuilder = groupBySqlBuilderObjectMother.get();

        // ACT
        const sqlQuery = groupByBuilder.build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("GROUP BY");
    });

    it('can add groupBy field', () => {
        // ARRANGE
        const groupByBuilder = groupBySqlBuilderObjectMother.get();
        const field = fieldObjectMother.get('gender', 'gender', 'string');

        // ACT
        const sqlQuery = groupByBuilder
            .field(field, patientSelector)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual("GROUP BY resource->>'gender'");
    });

    it('can add groupByCompiledField', () => {
        // ARRANGE
        const groupByBuilder = groupBySqlBuilderObjectMother.get();
        const compiledFieldName = 'period_start';

        // ACT
        const sqlQuery = groupByBuilder
            .compiledField(compiledFieldName)
            .build(patientSelector, filterTypes);

        // ASSERT
        expect(sqlQuery).toEqual('GROUP BY period_start');
    });
});