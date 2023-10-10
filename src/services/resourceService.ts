import aidboxProxy from '../infrastructure/aidbox/aidboxProxy';

/**
 * Obtains meta-data on available resources.
 */
export async function getResourcesInfo() {
    const resources = ['Patient', 'Observation', 'Encounter', 'Condition', 'MedicationAdministration', 'ImagingStudy', 'Location', 'Procedure']
    const results: { resource: string; count: any; }[] = []
    for (const resource of resources){
        const query = `SELECT reltuples::bigint AS estimate FROM pg_class WHERE oid = 'public.${resource}'::regclass;`; //quick estimate of table row count
        const result = await aidboxProxy.executeQuery(query);
        results.push({
            resource : resource,
            count: result[0]
        })
    }
    return results
}

export async function getAidboxInfo() {
    const query = 'health'
    const result = await aidboxProxy.executeAidbox(query);
    return result;
}
