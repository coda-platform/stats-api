import fieldPathFormatter from "../fieldPathFormatter";
import jsonTypePathCompiler from "../../queries/jsonTypePathCompiler";
import Selector from "../../../models/request/selector";


function getQuery(filterPath: string, selector: Selector): string {
    const jsonTypePathCompiled = jsonTypePathCompiler.getPathCompiled(filterPath, selector);
    const fieldPathFormatted = fieldPathFormatter.formatPath(filterPath);

    return `${jsonTypePathCompiled} AS ${fieldPathFormatted}`;
}

export default {
    getQuery
};

