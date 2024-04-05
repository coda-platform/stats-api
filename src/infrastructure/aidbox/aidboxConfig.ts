const client = {
  id: process.env.CODA_STATS_API_FHIR_STORE_CLIENT_ID ? process.env.CODA_STATS_API_FHIR_STORE_CLIENT_ID : process.env.CODA19_STATS_API_CLIENT_ID,
  secret: process.env.CODA_STATS_API_FHIR_STORE_CLIENT_SECRET ? process.env.CODA_STATS_API_FHIR_STORE_CLIENT_SECRET : process.env.CODA19_STATS_API_CLIENT_SECRET
};

const authEncoded = Buffer.from(`${client.id}:${client.secret}`).toString('base64');

const aidboxConfig = {
  baseURL: process.env.CODA_FHIR_STORE_URL ? process.env.CODA_FHIR_STORE_URL : process.env.CODA19_STATS_API_AIDBOX_URL,
  headers: {
      'Authorization': `Basic ${authEncoded}`
  }
};

export {
  aidboxConfig
};