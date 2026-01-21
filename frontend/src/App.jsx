import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import EligibleSchemes from './pages/EligibleSchemes';
import SchemeDetails from './pages/SchemeDetails';
import ApplicationTracker from './pages/ApplicationTracker';
import DocumentCheck from './pages/DocumentCheck';
import RiskReport from './pages/RiskReport';
import Profile from './pages/Profile';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/schemes" element={<EligibleSchemes />} />
                            <Route path="/schemes/:id" element={<SchemeDetails />} />
                            <Route path="/applications" element={<ApplicationTracker />} />
                            <Route path="/documents" element={<DocumentCheck />} />
                            <Route path="/risk/:id" element={<RiskReport />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
