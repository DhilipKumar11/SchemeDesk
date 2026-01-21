import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
            padding: '1rem 0',
            boxShadow: 'var(--shadow-lg)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    lineHeight: '1.2'
                }}>
                    <span>SchemeDesk</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: '400', opacity: 0.9 }}>
                        Eligibility Intelligence Layer
                    </span>
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>
                                Intelligence
                            </Link>
                            <Link to="/schemes" style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>
                                Schemes
                            </Link>
                            <Link to="/applications" style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>
                                Pipeline
                            </Link>
                            <Link to="/profile" style={{ color: 'white', fontWeight: '500', fontSize: '0.875rem' }}>
                                Profile
                            </Link>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm" style={{ borderColor: 'white', color: 'white' }}>
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-secondary btn-sm">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
