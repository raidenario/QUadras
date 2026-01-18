import axios from 'axios';
import { Platform } from 'react-native';

// URL base da API
// Android Emulator usa 10.0.2.2 para acessar o localhost da máquina host
// iOS Simulator usa localhost normalmente
const BASE_URL = Platform.select({
    android: 'http://192.168.15.2:4000/api/v1',
    ios: 'http://192.168.15.2:4000/api/v1',
    web: 'http://localhost:4000/api/v1',
    default: 'http://192.168.15.2:4000/api/v1',
});

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 segundos de timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para logs (opcional, ajuda no debug)
api.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2));
    return request;
});

api.interceptors.response.use(response => {
    console.log('Response:', JSON.stringify(response, null, 2));
    return response;
});

export default api;
