import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add token if available (but not required)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors gracefully
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't redirect on auth errors for demo mode
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getAllSchemes = () => api.get('/schemes');

export const getSchemeById = (id) => api.get(`/schemes/${id}`);

export const getEligibleSchemes = () => {
    // For demo mode, just get all schemes
    return api.get('/schemes');
};

export default api;
