import FieldInfo from "../../../models/fieldInfo";
import Breakdown from "../../../models/request/breakdown";
import Field from "../../../models/request/field";
import Filter from "../../../models/request/filter";
import Selector from "../../../models/request/selector";
import fieldLabelFormatter from "../fieldLabelFormatter";
import arrayFieldDetector from "../fields/arrayFieldDetector";
import SqlBuilder from "../sqlBuilder/sqlBuilder";


function getQuery(selector: Selector,
    filterTypes: Map<Filter, FieldInfo>,
    fieldTypes: Map<Field, FieldInfo>,
    breakdown: Breakdown): string {

    const breakdownField = breakdown.resource.field;
    const breakdownFieldLabel = findLabel(breakdownField, selector);
    const step = breakdown.slices.step;

    const sqlBuilder = new SqlBuilder()
        .select()
        .breakdownPeriodStart(step, breakdownFieldLabel)
        .comma()
        .namedCountAll('count_in_period')
        .from()
        .subquery(fieldTypes)
        .groupBy()
        .compiledField('period_start');

    
        return sqlBuilder.build(selector, filterTypes);
}

function findLabel(breakdownField: string, selector: Selector): string{
    const label = selector.fields.find(field => {
        return field.path == breakdownField;
    })?.label

    if(label){ 
        return fieldLabelFormatter.formatLabel(label)
    }
    else if(selector.joins){
        return findLabel(breakdownField, selector.joins)
    }
    else{
        return ''
    }
}

export default {
    getQuery
}