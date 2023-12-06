import Options from "../../../../../src/models/request/options";
import Selector from "../../../../../src/models/request/selector";
import SummerizeRequestBody from "../../../../../src/models/request/summarizeRequestBody";
import optionsObjectMother from "./optionsObjectMother";

function get(selectors: Selector[], options?: Options): SummerizeRequestBody {
    options = options ?? optionsObjectMother.get();
    return {
        selectors,
        options
    };
}

export default {
    get
};