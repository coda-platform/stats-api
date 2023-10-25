import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.CODA_FHIR_STORE_URL
});

const client = {
    id: process.env.CODA_STATS_API_FHIR_STORE_CLIENT_ID,
    secret: process.env.CODA_STATS_API_FHIR_STORE_CLIENT_SECRET
}

const authEncoded = Buffer.from(`${client.id}:${client.secret}`).toString('base64');
const axiosConfig = {
    headers: {
        'Authorization': `Basic ${authEncoded}`
    }
};

async function executeQuery(query: string): Promise<any> {
    try {
        const response = await instance.post('$sql?_format=json',
            [query],
            axiosConfig);
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error)){
            if(error.response){
                error.message = error.response.data
            }
            else
                error.message = "Could not receive or parse response from database"
        }
        return error
    }
}

export default {
    executeQuery
}