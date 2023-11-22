import QueryDataResults from "../../../../src/domain/queries/queryDataResults";

function get(): QueryDataResults {
    return new QueryDataResults();
}

export default {
    get
};