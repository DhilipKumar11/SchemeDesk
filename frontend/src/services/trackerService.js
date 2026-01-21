import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getUserApplications = () => api.get('/applications');

export const getApplicationById = (id) => api.get(`/applications/${id}`);

export const createApplication = (schemeId) =>
    api.post('/applications', { scheme_id: schemeId });

export const updateApplicationStatus = (id, status) =>
    api.patch(`/applications/${id}/status`, { status });

export const getRiskScore = (applicationId) =>
    api.get(`/applications/${applicationId}/risk`);

export const getApplicationStats = () => api.get('/applications/stats');

export default api;
