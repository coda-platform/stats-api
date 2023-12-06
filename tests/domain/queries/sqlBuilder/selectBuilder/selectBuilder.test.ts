import selectBuilder from "../../../../../src/domain/queries/sqlBuilder/selectBuilder/selectBuilder";

describe('selectBuilder tests', () => {
    it('return SELECT', () => {
        expect(selectBuilder.build()).toEqual("SELECT");
    });
});