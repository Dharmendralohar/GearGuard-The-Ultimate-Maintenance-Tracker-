import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('gearguard_user');
        return stored ? JSON.parse(stored) : null;
    });

    const login = (provider) => {
        // Simulate login
        const mockUser = {
            id: 'u1',
            name: 'Demo User',
            email: 'demo@gearguard.com',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff',
            provider
        };
        setUser(mockUser);
        localStorage.setItem('gearguard_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('gearguard_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
