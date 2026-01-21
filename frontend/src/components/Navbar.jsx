import { Link } from 'react-router-dom';

function Navbar() {
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
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
