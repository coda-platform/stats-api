import fromResourceTableBuilder from "../../../../../src/domain/queries/sqlBuilder/fromBuilder/fromResourceTableBuilder";
import selectorObjectMother from "../../../../utils/objectMothers/models/selectorObjectMother"

describe('fromResourceTableBuilder tests', () => {
    it('returns selector resource as table name with table name lowercase', () => {
        // ARRANGE
        const selector = selectorObjectMother.get('Observation', 'observation', [], []);

        // ACT
        const result = fromResourceTableBuilder.build(selector);

        // ASSERT
        expect(result).toEqual('Observation observation_table');
    })

    it('escapes resource to avoid sql injections', () => {
        // ARRANGE
        const selector = selectorObjectMother.get("Observation'--drop", 'observation', [], []);

        // ACT
        const result = fromResourceTableBuilder.build(selector);

        // ASSERT
        expect(result).toEqual('Observation observation_table');
    })
})