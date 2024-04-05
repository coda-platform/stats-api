import Selector from "../models/request/selector";
import queryStringEscaper from "./queries/queryStringEscaper";

const resourceArrayfields = new Map<string, string[]>();

resourceArrayfields.set('patient', [
    "name",
    "name.given",
    "address",
    "link",
]);

resourceArrayfields.set('observation', [
    "code.coding",
    "link",
    "interpretation",
    "interpretation.coding",
    "bodySite.coding",
    "value.CodeableConcept.coding",
]);

resourceArrayfields.set('encounter', [
    "identifier",
    "location",
    "serviceType.coding",
    "priority.coding",
    "type",
    "type.coding",
    "reasonCode",
    "episodeOfCare",
    "diagnosis",
    "diagnosis.condition.coding"
]);

resourceArrayfields.set('location', [
    "type",
    "type.coding",
    "physicalType.coding",
    "identifier",
]);

resourceArrayfields.set('medicationadministration', [
    "medication.CodeableConcept.coding",
    "contained",
    "contained.code.coding",
]);

resourceArrayfields.set('diagnosticreport', [
    "category",
    "category.coding",
    "contained",
    "contained.component",
    "contained.component.code.coding",
    "contained.component.valueCodeableConcept.coding",
]);

resourceArrayfields.set('procedure', [
    "identifier",
    "partOf",
    "statusReason.coding",
    "category.coding",
    "code.coding",
    "performer",
    "performer.function.coding",
    "reasonCode",
    "reasonReference",
    "bodysite",
    "bodysite.coding",
    "outcome.coding",
    "report",
    "complication",
    "followUp",
    "followUp.coding",
    "note",
    "focalDevice",
    "focalDevice.action.coding",
    "used"
]);

resourceArrayfields.set('condition', [
    "identifier",
    "clinicalStatus.coding",
    "verificationStatus.coding",
    "category",
    "category.coding",
    "severity.coding",
    "code.coding",
    "bodysite",
    "bodysite.coding",
    "stage",
    "stage.summary.coding",
    "stage.assessment",
    "stage.type.coding",
    "evidence",
    "evidence.code",
    "evidence.code.coding"
]);

function get(selector: Selector): string[] {
    const selectorResource = queryStringEscaper.escape(selector.resource.toLowerCase());
    const key = `${selectorResource}`;
    let arrayfields = resourceArrayfields.get(key);
    if(arrayfields === undefined){
        arrayfields = [];
    }
    return arrayfields;
}

export default {
    get
};