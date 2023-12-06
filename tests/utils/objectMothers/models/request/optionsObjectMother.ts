import Measures from "../../../../../src/models/request/measures";
import Options from "../../../../../src/models/request/options";
import measuresObjectMother from "./measuresObjectMother";

function get(measures?: Measures): Options {
    measures = measures ?? measuresObjectMother.get();
    return {
        measures
    };
}

export default {
    get
};