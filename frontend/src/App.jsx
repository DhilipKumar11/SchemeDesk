import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EligibleSchemes from './pages/EligibleSchemes';
import SchemeDetails from './pages/SchemeDetails';
import DocumentCheck from './pages/DocumentCheck';
import ApplicationTracker from './pages/ApplicationTracker';
import Profile from './pages/Profile';
import RiskReport from './pages/RiskReport';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <main style={{ flex: 1, paddingTop: '2rem', paddingBottom: '2rem' }}>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />

                            <Route path="/schemes" element={
                                <ProtectedRoute>
                                    <EligibleSchemes />
                                </ProtectedRoute>
                            } />

                            <Route path="/schemes/:id" element={
                                <ProtectedRoute>
                                    <SchemeDetails />
                                </ProtectedRoute>
                            } />

                            <Route path="/documents/:applicationId" element={
                                <ProtectedRoute>
                                    <DocumentCheck />
                                </ProtectedRoute>
                            } />

                            <Route path="/applications" element={
                                <ProtectedRoute>
                                    <ApplicationTracker />
                                </ProtectedRoute>
                            } />

                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />

                            <Route path="/risk/:applicationId" element={
                                <ProtectedRoute>
                                    <RiskReport />
                                </ProtectedRoute>
                            } />

                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
