import WhereJsonArrayFormatterBuilder from "../../../../../../../src/domain/queries/sqlBuilder/whereBuilder/whereJsonArrayFormatterBuilder";

function get(fieldPath: string, selectorLabel:string): WhereJsonArrayFormatterBuilder {
    return new WhereJsonArrayFormatterBuilder(fieldPath, selectorLabel);
}

export default {
    get
};