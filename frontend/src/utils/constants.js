export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export const DOCUMENT_TYPES = [
    'aadhaar',
    'pan',
    'income_certificate',
    'address_proof',
    'bank_statement',
    'caste_certificate',
    'age_proof',
    'passport',
    'driving_license',
    'voter_id'
];

export const APPLICATION_STATUS = {
    submitted: { label: 'Submitted', color: 'info' },
    under_review: { label: 'Under Review', color: 'warning' },
    approved: { label: 'Approved', color: 'success' },
    rejected: { label: 'Rejected', color: 'danger' }
};

export const SCHEME_CATEGORIES = [
    'Agriculture',
    'Health',
    'Education',
    'Housing',
    'Business',
    'Pension',
    'Women Empowerment',
    'Social Welfare'
];
