import ContinuousMesure from "../../../../models/continuousMeasure";
import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Measures from "../../../../models/request/measures";
import Selector from "../../../../models/request/selector";
import calculatedFields from "../../../calculatedFields";
import arrayFieldDetector from "../../fields/arrayFieldDetector";
import SelectSqlBuilder from "../../sqlBuilder/selectBuilder/selectSqlBuilder";
import SqlBuilder from "../../sqlBuilder/sqlBuilder";

function getQuery(selector: Selector, field: Field, filterFieldTypes: Map<Filter, FieldInfo>, fieldTypes: Map<Field, FieldInfo>, measures: Measures): string {

    const selectQuery = new SqlBuilder()
        .select();

    let measureIndex = 0;

    selectFromMeasure(selectQuery, selector, field, fieldTypes, measures.continuous[measureIndex]);
    measureIndex++;

    while (measureIndex < measures.continuous.length) {
        selectQuery.comma();
        selectFromMeasure(selectQuery, selector, field, fieldTypes, measures.continuous[measureIndex]);
        measureIndex++;
    }

    const queryToFromPart = selectQuery
        .from()
        .resourceTable();

    if (!selector.condition || selector.condition.conditions.length === 0) {
        return queryToFromPart
            .possibleJoin(fieldTypes)
            .build(selector, filterFieldTypes);
    }

    const hasArrayComparisonFilters = arrayFieldDetector.hasArrayComparisonFilters(selector);

    const builderWithFilter = hasArrayComparisonFilters ?
        queryToFromPart
            .crossJoinForArrayFilters()
            .possibleJoin(fieldTypes)
            .where()
            .fieldFilter()
        : queryToFromPart
            .possibleJoin(fieldTypes)
            .where()
            .fieldFilter()

    return builderWithFilter.build(selector, filterFieldTypes);
}

function selectFromMeasure(query: SelectSqlBuilder, selector: Selector, field: Field, fieldTypes: Map<Field, FieldInfo>, measure: ContinuousMesure) {

    switch (measure) {
        case 'count':
            query.fieldSum(field, fieldTypes, selector);
            break;
        case 'mean':
            query.countAll().comma().fieldMean(field, fieldTypes, selector);
            break;
        case 'stdev':
            query.fieldStdDev(field, fieldTypes, selector);
            break;
        case 'ci95':
            query.fieldCiLow(field, fieldTypes, selector)
                .comma()
                .fieldCiHigh(field, fieldTypes, selector);
    }
}

export default {
    getQuery
};