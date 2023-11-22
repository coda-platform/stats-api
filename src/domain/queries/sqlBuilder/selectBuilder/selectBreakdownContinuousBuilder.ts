function build(step: number, min: number, max: number, label: string) {

    let caseWhen = "";

    if((max-min) / step > 100){ //limit amount of breakdown steps
        step = (max-min) / 100;
    }
    for(let i = min; i+step <= max; i+=step){
        const iMin = i;
        const iMax = i + step;
        const when = `WHEN ${label} >= ${iMin} AND ${label} < ${iMax} THEN '${iMin}' `;
        caseWhen += when;
    }

    return `CASE ${caseWhen} END as breakdown`;
}

export default {
    build
};