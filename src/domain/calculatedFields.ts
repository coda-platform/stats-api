import Selector from "../models/request/selector";

const patientCalculatedFields = new Map<string, string>();

patientCalculatedFields.set("age", "CASE WHEN resource->'deceased'->>'dateTime' IS NULL THEN CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->>'birthDate')))END ELSE CASE WHEN length(resource->>'birthDate') < 7 THEN null WHEN length(resource->>'birthDate') = 7 THEN extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate' || '-01'))) ELSE extract(year from AGE(date(resource->'deceased'->>'dateTime'), date(resource->>'birthDate'))) END END");
patientCalculatedFields.set("isDeceased", "resource->'deceased'->>'dateTime' IS NOT NULL OR resource->'deceased'->>'boolean' IS NOT NULL");


function get(selector: Selector, filterPath: string): string | undefined {
    const resource = selector.resource.toLocaleLowerCase();

    switch(resource) {
        case 'patient':
            return patientCalculatedFields.get(filterPath);
        default:

    }
}

export default {
   get
};