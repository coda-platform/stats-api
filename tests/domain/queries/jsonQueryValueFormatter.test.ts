import jsonQueryValueFormatter from "../../../src/domain/queries/jsonQueryValueFormatter";
import fieldInfoObjectMother from "../../utils/objectMothers/models/fieldInfoObjectMother";
import filterObjectMother from "../../utils/objectMothers/models/filterObjectMother";

describe('jsonQueryValueFormatter tests', () => {
    it("With string field type, value is padded with ' ", () => {
        // ARRANGE
        const fieldInfo = fieldInfoObjectMother.get('string');
        const filter = filterObjectMother.get("value", 'is', 'value', 'string');

        // ACT
        const value = jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);

        // ASSERT
        expect(value).toEqual("'value'");
    });

    it("With boolean field type, value is padded with ' ", () => {
        // ARRANGE
        const fieldInfo = fieldInfoObjectMother.get('boolean');
        const filter = filterObjectMother.get("value", 'is', 'value', 'boolean');

        // ACT
        const value = jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);

        // ASSERT
        expect(value).toEqual("value");
    });

    it("With number field type, value is padded with ' ", () => {
        // ARRANGE
        const fieldInfo = fieldInfoObjectMother.get('number');
        const filter = filterObjectMother.get("value", 'is', '45', 'integer');

        // ACT
        const value = jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);

        // ASSERT
        expect(value).toEqual("'45'");
    });

    const equalOperators = ['is', 'equals', 'on'];

    equalOperators.forEach(eq => {
        it(`With null value, ${eq} operator, value is as is`, () => {
            // ARRANGE
            const fieldInfo = fieldInfoObjectMother.get('string');
            const filter = filterObjectMother.get("value", 'is', 'null', 'string');

            // ACT
            const value = jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);

            // ASSERT
            expect(value).toEqual("null");
        });

        it(`With NULL value, ${eq} operator, value is as is`, () => {
            // ARRANGE
            const fieldInfo = fieldInfoObjectMother.get('string');
            const filter = filterObjectMother.get("value", 'is', 'NULL', 'string');

            // ACT
            const value = jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);

            // ASSERT
            expect(value).toEqual("NULL");
        });
    });


    it("With null value, not a equal operator, value is padded with '", () => {
        // ARRANGE
        const fieldInfo = fieldInfoObjectMother.get('string');
        const filter = filterObjectMother.get("value", 'after', 'null', 'string');

        // ACT
        const value = jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);

        // ASSERT
        expect(value).toEqual("null");
    });

    it("With NULL value, not a equal operator, value is padded with '", () => {
        // ARRANGE
        const fieldInfo = fieldInfoObjectMother.get('string');
        const filter = filterObjectMother.get("value", 'after', 'NULL', 'string');

        // ACT
        const value = jsonQueryValueFormatter.formatValueForSql(filter, fieldInfo);

        // ASSERT
        expect(value).toEqual("NULL");
    });
});