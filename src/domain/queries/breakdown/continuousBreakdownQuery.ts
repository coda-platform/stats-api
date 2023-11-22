import FieldInfo from "../../../models/fieldInfo";
import Breakdown from "../../../models/request/breakdown";
import BreakdownResource from "../../../models/request/breakdownResource";
import Field from "../../../models/request/field";
import Filter from "../../../models/request/filter";
import Selector from "../../../models/request/selector";
import fieldLabelFormatter from "../fieldLabelFormatter";
import SqlBuilder from "../sqlBuilder/sqlBuilder";
import { ConditionOperator } from "../../../models/request/conditionOperator";

function getQuery(selector: Selector,
    filterTypes: Map<Filter, FieldInfo>,
    fieldTypes: Map<Field, FieldInfo>,
    breakdown: Breakdown): string {

    const breakdownField = breakdown.resource;
    const breakdownFieldLabel = fieldLabelFormatter.formatLabel(findField(breakdownField, selector).label);

    const step = breakdown?.slices.step;
    const max = parseFloat(breakdown?.slices.max);
    const min = parseFloat(breakdown?.slices.min);

    const sqlBuilder = new SqlBuilder()
        .select()
        .breakdownContinuous(step, min, max, breakdownFieldLabel)
        .comma()
        .countAll()
        .from()
        .subquery(fieldTypes)
        .groupBy()
        .compiledField('breakdown');

    return sqlBuilder.build(selector, filterTypes);
}

function findField(breakdown: BreakdownResource, selector: Selector): Field {
    let field = selector.fields.find(field => {
        return field.path === breakdown.field;
    });

    if (field) {
        return field;
    }
    else if (selector.joins) {
        return findField(breakdown, selector.joins);
    }
    else {
        field = {
            path: breakdown.field,
            label: `${breakdown.field}Breakdown`,
            type: breakdown.fieldType
        };
        selector.joins = {
            resource: breakdown.type,
            label: `${breakdown.type}Breakdown`,
            condition: {
                conditionOperator: ConditionOperator.and,
                conditions: []
            },
            fields: [field]
        };
        return field;
    }
}

export default {
    getQuery
};