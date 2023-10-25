import CategoricalMesure from "../../models/categoricalMeasure";
import ContinuousMesure from "../../models/continuousMeasure";
import Field from "../../models/request/field";
import Selector from "../../models/request/selector";

type queryAndResult = { query: string, result: any };
export default class QueryDataResults {
    selectorResults: Map<Selector, queryAndResult>;
    breakdownResults: Map<Selector, queryAndResult>;
    results: Map<Selector, Map<Field, Map<ContinuousMesure | CategoricalMesure, queryAndResult>>>;

    constructor() {
        this.selectorResults = new Map<Selector, queryAndResult>();
        this.breakdownResults = new Map<Selector, queryAndResult>();
        this.results = new Map<Selector, Map<Field, Map<ContinuousMesure | CategoricalMesure, queryAndResult>>>();
    }

    addSelectorResult(selector: Selector, result: queryAndResult) {
        this.selectorResults.set(selector, result);
    }

    getSelectorResult(selector: Selector) {
        const result = this.selectorResults.get(selector);
        if (!result) throw new Error('No result for this selector');

        return result;
    }

    addSelectorBreakdownResult(selector: Selector, result: queryAndResult) {
        this.breakdownResults.set(selector, result);
    }

    getSelectorBreakdownResult(selector: Selector) {
        const result = this.breakdownResults.get(selector);
        if (!result) return new Error('No result for this selector');

        return result;
    }

    addResult(selector: Selector, field: Field, mesure: ContinuousMesure | CategoricalMesure, result: queryAndResult) {
        const selectorResults = this.results.get(selector) ?? new Map<Field, Map<ContinuousMesure | CategoricalMesure, any>>();
        this.results.set(selector, selectorResults);

        const fieldResults = selectorResults.get(field) ?? new Map<ContinuousMesure | CategoricalMesure, any>();
        selectorResults.set(field, fieldResults);

        fieldResults.set(mesure, result);
    }

    getResult(selector: Selector, field: Field, mesure: ContinuousMesure | CategoricalMesure) {
        const selectorResults = this.results.get(selector);
        if (!selectorResults) return new Error('No results for this selector');

        const fieldResults = selectorResults.get(field);
        if (!fieldResults) return new Error('No results for this field');

        const result = fieldResults.get(mesure);
        if (!result) return new Error('No result for this measure');

        return result;
    }

    getFieldResults(selector: Selector, field: Field) {
        const selectorResults = this.results.get(selector);
        if (!selectorResults) return new Error('No results for this selector');

        const fieldResults = selectorResults.get(field);
        if (!fieldResults) return new Error('No results for this field');

        const fieldQueryAndResults = new Array<queryAndResult>();
        fieldResults.forEach((value) => {
            fieldQueryAndResults.push(value);
        })

        return fieldQueryAndResults;
    }
}