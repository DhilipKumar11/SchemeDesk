import axios from 'axios';
import { API_URL } from '../utils/constants';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createApplication = async (schemeId) => {
    const response = await axios.post(`${API_URL}/applications`,
        { scheme_id: schemeId },
        { headers: getAuthHeader() }
    );
    return response.data;
};

export const getUserApplications = async () => {
    const response = await axios.get(`${API_URL}/applications`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getApplicationById = async (id) => {
    const response = await axios.get(`${API_URL}/applications/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getRiskScore = async (applicationId) => {
    const response = await axios.get(`${API_URL}/applications/${applicationId}/risk`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getApplicationStats = async () => {
    const response = await axios.get(`${API_URL}/applications/stats`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export default {
    createApplication,
    getUserApplications,
    getApplicationById,
    getRiskScore,
    getApplicationStats
};
