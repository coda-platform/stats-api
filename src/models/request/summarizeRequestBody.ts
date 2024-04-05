import Options from "./options";
import Selector from "./selector";

export default interface SummarizeRequestBody {
    selectors: Selector[];
    options: Options;
}