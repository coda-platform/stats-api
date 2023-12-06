import jsonFilterOperatorFormatter from "../../../src/domain/queries/jsonFilterOperatorFormatter";
import filterObjectMother from "../../utils/objectMothers/models/filterObjectMother";

describe('jsonFilterOperatorFormatter tests', () => {
    const standardTestParams = [
        { operator: 'is', sqlOperand: '=' },
        { operator: 'equals', sqlOperand: '=' },
        { operator: 'on', sqlOperand: '=' },
        { operator: 'after', sqlOperand: '>' },
        { operator: 'moreThan', sqlOperand: '>' },
        { operator: 'more_Than', sqlOperand: '>' },
        { operator: 'afterOrOn', sqlOperand: '>=' },
        { operator: 'after_Or_On', sqlOperand: '>=' },
        { operator: 'moreOrEqualThan', sqlOperand: '>=' },
        { operator: 'more_Or_Equal_Than', sqlOperand: '>=' },
        { operator: 'before', sqlOperand: '<' },
        { operator: 'lessThan', sqlOperand: '<' },
        { operator: 'less_Than', sqlOperand: '<' },
        { operator: 'beforeOrOn', sqlOperand: '<=' },
        { operator: 'before_Or_On', sqlOperand: '<=' },
        { operator: 'lessOrEqualThan', sqlOperand: '<=' },
        { operator: 'less_Or_Equal_Than', sqlOperand: '<=' },
        { operator: 'not', sqlOperand: '!=' },
        { operator: 'isNot', sqlOperand: '!=' },
        { operator: 'is_Not', sqlOperand: '!=' },
        { operator: 'notEquals', sqlOperand: '!=' },
        { operator: 'not_Equals', sqlOperand: '!=' },
        { operator: 'notOn', sqlOperand: '!=' },
        { operator: 'not_On', sqlOperand: '!=' },
        { operator: 'matches', sqlOperand: 'LIKE' },
        { operator: 'like', sqlOperand: 'LIKE' }
    ];

    standardTestParams.forEach(tp => {
        it(`With ${tp.operator} the resulting sql operand is ${tp.sqlOperand}`, () => {
            // ARRANGE
            const filter = filterObjectMother.get('field', tp.operator, 'value', 'integer');

            // ACT
            const resultSqlOperand = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

            // ASSERT
            expect(resultSqlOperand).toEqual(tp.sqlOperand);
        });

        it(`With ${tp.operator.toLowerCase()} the resulting sql operand is ${tp.sqlOperand}`, () => {
            // ARRANGE
            const filter = filterObjectMother.get('field', tp.operator.toLowerCase(), 'value', 'integer');

            // ACT
            const resultSqlOperand = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

            // ASSERT
            expect(resultSqlOperand).toEqual(tp.sqlOperand);
        });

        it(`With ${tp.operator.toUpperCase()} the resulting sql operand is ${tp.sqlOperand}`, () => {
            // ARRANGE
            const filter = filterObjectMother.get('field', tp.operator.toUpperCase(), 'value', 'integer');

            // ACT
            const resultSqlOperand = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

            // ASSERT
            expect(resultSqlOperand).toEqual(tp.sqlOperand);
        });
    });

    const nullAffectedTestParams = [
        { operator: 'is', sqlOperand: 'is' },
        { operator: 'equals', sqlOperand: 'is' },
        { operator: 'on', sqlOperand: 'is' },
    ];

    nullAffectedTestParams.forEach(tp => {
        it(`With ${tp.operator} and null filter the resulting sql operand is ${tp.sqlOperand}`, () => {
            // ARRANGE
            const filter = filterObjectMother.get('field', tp.operator, 'null', 'integer');

            // ACT
            const resultSqlOperand = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

            // ASSERT
            expect(resultSqlOperand).toEqual(tp.sqlOperand);
        });

        it(`With ${tp.operator.toLowerCase()} and null  the resulting sql operand is ${tp.sqlOperand}`, () => {
            // ARRANGE
            const filter = filterObjectMother.get('field', tp.operator.toLowerCase(), 'null', 'integer');

            // ACT
            const resultSqlOperand = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

            // ASSERT
            expect(resultSqlOperand).toEqual(tp.sqlOperand);
        });

        it(`With ${tp.operator.toUpperCase()} and null  the resulting sql operand is ${tp.sqlOperand}`, () => {
            // ARRANGE
            const filter = filterObjectMother.get('field', tp.operator.toUpperCase(), 'null', 'integer');

            // ACT
            const resultSqlOperand = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

            // ASSERT
            expect(resultSqlOperand).toEqual(tp.sqlOperand);
        });

        it(`With ${tp.operator} and NULL filter the resulting sql operand is ${tp.sqlOperand}`, () => {
            // ARRANGE
            const filter = filterObjectMother.get('field', tp.operator, 'NULL', 'integer');

            // ACT
            const resultSqlOperand = jsonFilterOperatorFormatter.formatOperatorForSql(filter);

            // ASSERT
            expect(resultSqlOperand).toEqual(tp.sqlOperand);
        });
    });
});