import axios from 'axios';
import { API_URL } from '../utils/constants';

const API = axios.create({
    baseURL: API_URL
});

// Add token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data;
};

export const getMe = async () => {
    const response = await API.get('/auth/me');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await API.put('/auth/profile', profileData);
    return response.data;
};

export default { register, login, getMe, updateProfile };
