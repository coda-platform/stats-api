import FieldInfo from "../../../../models/fieldInfo";
import Field from "../../../../models/request/field";
import Filter from "../../../../models/request/filter";
import Selector from "../../../../models/request/selector";
import commaBuilder from "../commaBuilder";
import FromSqlBuilder from "../fromBuilder/fromSqlBuilder";
import SqlBuilder from "../sqlBuilder";
import selectBreakdownPeriodStartBuilder from "./selectBreakdownPeriodStartBuilder";
import selectBuilder from "./selectBuilder";
import selectCountAllBuilder from "./selectCountAllBuilder";
import selectCountFieldBuilder from "./selectCountFieldBuilder";
import selectCountSubqueryFieldBuilder from "./selectCountSubqueryFieldBuilder";
import selectDistinctBuilder from "./selectDistinctBuilder";
import selectFieldBuilder from "./selectFieldBuilder";
import selectFieldCiHighBuilder from "./selectFieldCiHighBuilder";
import selectFieldCiLowBuilder from "./selectFieldCiLowBuilder";
import selectFieldMeanBuilder from "./selectFieldMeanBuilder";
import selectFieldsBuilder from "./selectFieldsBuilder";
import selectFieldsJsonBuilder from "./selectFieldsJsonBuilder";
import selectFieldStdDevBuilder from "./selectFieldStdDevBuilder";
import selectFieldSumBuilder from "./selectFieldSumBuilder";
import selectFieldTypesBuilder from "./selectFieldTypesBuilder";
import selectFilterTypesBuilder from "./selectFilterTypesBuilder";
import selectJoinIdBuilder from "./selectJoinIdBuilder";
import selectNamedCountAllBuilder from "./selectNamedCountAllBuilder";
import selectSubqueryFieldBuilder from "./selectSubqueryFieldBuilder";
import selectCastedFieldsBuilder from "./selectCastedFieldsBuilder";
import selectBreakdownContinuousBuilder from "./selectBreakdownContinuousBuilder";
import selectFieldAliasBuilder from "./selectFieldAliasBuilder";

export default class SelectSqlBuilder {
    sqlBuilder: SqlBuilder;

    constructor(sqlBuilder: SqlBuilder) {
        this.sqlBuilder = sqlBuilder;

        this.sqlBuilder.requestBuilders.push(selectBuilder.build);
    }

    distinct() {
        this.sqlBuilder.requestBuilders.push(selectDistinctBuilder.build);
        return this;
    }

    joinId() {
        const builderFunction = (selector: Selector) => selectJoinIdBuilder.build(selector);

        this.sqlBuilder.requestBuilders.push(builderFunction);
        return this;
    }

    fieldTypes() {
        this.sqlBuilder.requestBuilders.push(selectFieldTypesBuilder.build);
        return this;
    }

    fieldsJson() {
        this.sqlBuilder.requestBuilders.push(selectFieldsJsonBuilder.build);
        return this;
    }

    fields() {
        this.sqlBuilder.requestBuilders.push(selectFieldsBuilder.build);
        return this;
    }

    castedFields(selector: Selector, fieldTypes: Map<Field, FieldInfo>) {
        const builderFunction = () => selectCastedFieldsBuilder.build(selector, fieldTypes);
        this.sqlBuilder.requestBuilders.push(builderFunction);
        return this;
    }

    filterTypes() {
        this.sqlBuilder.requestBuilders.push(selectFilterTypesBuilder.build);
        return this;
    }

    countAll() {
        this.sqlBuilder.requestBuilders.push(selectCountAllBuilder.build);
        return this;
    }

    field(field: Field, selector: Selector) {
        const builderFunction = () => selectFieldBuilder.build(field, selector);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    fieldAlias(field: Field) {
        const builderFunction = () => selectFieldAliasBuilder.build(field);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    subqueryField(field: Field, subqueryName: string) {
        const builderFunction = () => selectSubqueryFieldBuilder.build(field, subqueryName);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    countField(field: Field, selector: Selector) {
        const builderFunction = () => selectCountFieldBuilder.build(field, selector);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    countSubqueryField(field: Field, subqueryName: string) {
        const builderFunction = () => selectCountSubqueryFieldBuilder.build(field, subqueryName);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    fieldSum(field: Field, fieldTypes: Map<Field, FieldInfo>, selector: Selector) {
        const builderFunction = () => selectFieldSumBuilder.build(field, fieldTypes, selector);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    fieldMean(field: Field, fieldTypes: Map<Field, FieldInfo>, selector:Selector) {
        const builderFunction = () => selectFieldMeanBuilder.build(field, fieldTypes, selector);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    fieldStdDev(field: Field, fieldTypes: Map<Field, FieldInfo>, selector: Selector) {
        const builderFunction = () => selectFieldStdDevBuilder.build(field, fieldTypes, selector);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    fieldCiLow(field: Field, fieldTypes: Map<Field, FieldInfo>, selector: Selector) {
        const builderFunction = () => selectFieldCiLowBuilder.build(field, fieldTypes, selector);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    fieldCiHigh(field: Field, fieldTypes: Map<Field, FieldInfo>, selector: Selector) {
        const builderFunction = () => selectFieldCiHighBuilder.build(field, fieldTypes, selector);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    namedCountAll(countName: string) {
        const builderFunction = () => selectNamedCountAllBuilder.build(countName);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    comma() {
        this.sqlBuilder.requestBuilders.push(commaBuilder.build);
        return this;
    }

    breakdownPeriodStart(step: number, breakdownFieldLabel: string) {
        const builderFunction = () => selectBreakdownPeriodStartBuilder.build(step ,breakdownFieldLabel);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;
    }

    breakdownContinuous(step: number, min: number , max: number, breakdownFieldLabel: string) {
        const builderFunction = () => selectBreakdownContinuousBuilder.build(step, min, max, breakdownFieldLabel);
        this.sqlBuilder.requestBuilders.push(builderFunction);

        return this;

    }

    from() {
        const fromSqlBuilder = new FromSqlBuilder(this.sqlBuilder);
        return fromSqlBuilder;
    }

    build(selector: Selector, filterFieldTypes: Map<Filter, FieldInfo>) {
        return this.sqlBuilder.build(selector, filterFieldTypes);
    }
}