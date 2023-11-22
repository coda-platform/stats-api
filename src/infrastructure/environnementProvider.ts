function isLocal() {
    const isLocalValue = process.env.CODA_STATS_API_IS_LOCAL_DEV;
    return isLocalValue && isLocalValue === 'true';
}

export default {
    isLocal
};