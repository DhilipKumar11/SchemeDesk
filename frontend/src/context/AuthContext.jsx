import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // Mock user data for demo purposes (no authentication required)
    const [user, setUser] = useState({
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@schemedesk.in',
        age: 30,
        income: 180000,
        state: 'Tamil Nadu',
        district: 'Chennai',
        gender: 'Male',
        category: 'General'
    });

    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [loading, setLoading] = useState(false);

    // Mock login function (not used but kept for compatibility)
    const login = async (email, password) => {
        setIsAuthenticated(true);
        return { success: true };
    };

    // Mock register function (not used but kept for compatibility)
    const register = async (userData) => {
        setUser({ ...user, ...userData });
        setIsAuthenticated(true);
        return { success: true };
    };

    // Mock logout function
    const logout = () => {
        // Do nothing - keep user logged in for demo
    };

    // Mock update profile function
    const updateProfile = async (updates) => {
        setUser({ ...user, ...updates });
        return { success: true };
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
