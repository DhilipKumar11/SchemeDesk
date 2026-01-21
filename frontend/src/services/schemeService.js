import axios from 'axios';
import { API_URL } from '../utils/constants';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllSchemes = async () => {
    const response = await axios.get(`${API_URL}/schemes`);
    return response.data;
};

export const getEligibleSchemes = async () => {
    const response = await axios.get(`${API_URL}/schemes/eligible`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const getSchemeById = async (id) => {
    const response = await axios.get(`${API_URL}/schemes/${id}`);
    return response.data;
};

export default { getAllSchemes, getEligibleSchemes, getSchemeById };
