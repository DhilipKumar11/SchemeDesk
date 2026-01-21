import axios from 'axios';
import { API_URL } from '../utils/constants';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadDocument = async (formData) => {
    const response = await axios.post(`${API_URL}/documents/upload`, formData, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getDocumentsByApplication = async (applicationId) => {
    const response = await axios.get(`${API_URL}/documents/application/${applicationId}`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export default { uploadDocument, getDocumentsByApplication };
