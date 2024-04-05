import axios from 'axios';
import { aidboxConfig } from './aidboxConfig';
import axiosErrorHandler from '../../utils/axiosErrorHandler';

async function executeQuery(query: string): Promise<any> {
    try {
        const response = await axios.post('$sql?_format=json', [query], aidboxConfig);
        return response.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
          throw axiosErrorHandler.handleAxiosError(error, query);
        }
        throw error;
      }
}

async function executeAidbox(query: string): Promise<any> {
    try {
        console.log(query)
        const response = await axios.get(query, aidboxConfig)
        return response.data
    }
    catch (error: any) {
        if (axios.isAxiosError(error)) {
          throw axiosErrorHandler.handleAxiosError(error, query);
        }
        throw error;
      }
}

export default {
    executeQuery, executeAidbox
}
