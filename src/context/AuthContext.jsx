import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const loadUser = async () => {
            try {
                const currentUser = api.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const register = async (name, phone, pin, role) => {
        setLoading(true);
        try {
            const userData = await api.register(name, phone, pin, role);
            setUser(userData);
            toast.success(`Welcome, ${userData.name}!`);
            return userData;
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Registration failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (phone, role, pin) => {
        setLoading(true);
        try {
            const userData = await api.login(phone, role, pin);
            setUser(userData);
            toast.success(`Welcome back, ${userData.name}!`);
            return userData;
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
        toast.success('Logged out successfully');
    };

    const updateUserLocation = async (lat, lng, address = null) => {
        if (!user) return;
        try {
            const updates = { location: { lat, lng } };
            if (address) updates.address = address;

            const updated = await api.updateProfile(user.id, updates);
            setUser(updated);
            toast.success('Location updated!');
        } catch (e) {
            toast.error('Failed to update location');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, updateUserLocation }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
