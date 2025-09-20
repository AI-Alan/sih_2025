import axios from 'axios';

import config from '../config/config';



const axiosInstance = axios.create({
    baseURL: config.API_BASE_URL,
    timeout: config.TIMEOUT,
    headers: config.DEFAULT_HEADERS,
}
)





export default axiosInstance;