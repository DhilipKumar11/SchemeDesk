import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES } from '../utils/constants';
import { validateEmail, validatePassword, validateRequired, validateAge, validateIncome } from '../utils/validators';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        income: '',
        state: '',
        district: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!validateRequired(formData.name)) newErrors.name = 'Name is required';
        if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
        if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
        if (formData.age && !validateAge(formData.age)) newErrors.age = 'Invalid age';
        if (formData.income && !validateIncome(formData.income)) newErrors.income = 'Invalid income';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setApiError('');

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (error) {
            setApiError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
            <div className="card">
                <div className="card-header text-center">
                    <h2>Register for SchemeDesk</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Create your account to discover eligible schemes</p>
                </div>

                {apiError && <div className="alert alert-danger">{apiError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                            />
                            {errors.name && <div className="form-error">{errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && <div className="form-error">{errors.email}</div>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password *</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                        />
                        {errors.password && <div className="form-error">{errors.password}</div>}
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">Age</label>
                            <input
                                type="number"
                                name="age"
                                className="form-control"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Your age"
                            />
                            {errors.age && <div className="form-error">{errors.age}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Annual Income (₹)</label>
                            <input
                                type="number"
                                name="income"
                                className="form-control"
                                value={formData.income}
                                onChange={handleChange}
                                placeholder="Annual income"
                            />
                            {errors.income && <div className="form-error">{errors.income}</div>}
                        </div>
                    </div>

                    <div className="grid grid-2">
                        <div className="form-group">
                            <label className="form-label">State</label>
                            <select
                                name="state"
                                className="form-control"
                                value={formData.state}
                                onChange={handleChange}
                            >
                                <option value="">Select State</option>
                                {INDIAN_STATES.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">District</label>
                            <input
                                type="text"
                                name="district"
                                className="form-control"
                                value={formData.district}
                                onChange={handleChange}
                                placeholder="Your district"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="card-footer text-center">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
