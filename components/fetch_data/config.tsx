// src/api/axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://beejobs.io.vn:14307', // Update with your server URL
    timeout: 10000,
});

export default axiosInstance;
