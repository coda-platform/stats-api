import FieldInfo from "../../models/fieldInfo";
import Field from "../../models/request/field";
import Selector from "../../models/request/selector";
import FieldReponse from "../../models/response/fieldResponse";
import QueryDataResults from "../queries/queryDataResults";
import FieldMetricCalculator from "./fieldMetricCalculator";
import contants from "../../constants";

export default class FieldReponseBuilder {
    private field: Field;
    private fieldMetricCalculators: FieldMetricCalculator[];

    constructor(field: Field, fieldMetricCalculators: FieldMetricCalculator[]) {
        this.field = field;
        this.fieldMetricCalculators = fieldMetricCalculators;
    }

    build(selector: Selector, queryDataResults: QueryDataResults, fieldTypes: Map<Field, FieldInfo>): FieldReponse {
        const aidboxField = fieldTypes.get(this.field);
        const measure = contants.numericalTypes.some(nt => nt === aidboxField?.type) ? "continuous" : "categorical";
        const metrics = this.fieldMetricCalculators.map(mc => {
            const value = mc.metricCalculation(selector, queryDataResults, this.field, mc.metric);

            return { [mc.metric]: value };
        });

        const results = queryDataResults.getFieldResults(selector, this.field);
        if(results instanceof Error){
            return Object.assign({ field: this.field.path, measure}, ...metrics);
        }
        const queries = results.map(qr => qr.query);
        return Object.assign({ field: this.field.path, queries, measure}, ...metrics);
    }
}