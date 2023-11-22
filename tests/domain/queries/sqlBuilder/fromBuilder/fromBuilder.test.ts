import fromBuilder from "../../../../../src/domain/queries/sqlBuilder/fromBuilder/fromBuilder";

describe('fromBuilder tests', () => {
    it('it returns FROM', () => {
        expect(fromBuilder.build()).toEqual('FROM');
    });
});