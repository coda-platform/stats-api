function build(step: number, breakdownFieldLabel: string) {

    return `to_timestamp(floor((extract('epoch' from (${breakdownFieldLabel})::timestamp) / ${step} )) * ${step}) AS period_start`;
}

export default {
    build
};