import commaBuilder from "../../../../src/domain/queries/sqlBuilder/commaBuilder";

describe('commaBuilder tests', () => {
    it('return comma and space', () => {
        expect(commaBuilder.build()).toEqual(",");
    });
});