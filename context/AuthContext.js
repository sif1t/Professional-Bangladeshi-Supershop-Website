import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data.user);
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const register = async (name, mobile, password) => {
        try {
            const { data } = await api.post('/auth/register', {
                name,
                mobile,
                password,
            });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const login = async (mobile, password) => {
        try {
            const { data } = await api.post('/auth/login', {
                mobile,
                password,
            });
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            router.push('/');
        }
    };

    const updateProfile = async (userData) => {
        try {
            const { data } = await api.put('/auth/profile', userData);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed',
            };
        }
    };

    const addAddress = async (address) => {
        try {
            const { data } = await api.post('/auth/address', address);
            setUser({ ...user, addresses: data.addresses });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add address',
            };
        }
    };

    const updateAddress = async (addressId, address) => {
        try {
            const { data } = await api.put(`/auth/address/${addressId}`, address);
            setUser({ ...user, addresses: data.addresses });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update address',
            };
        }
    };

    const deleteAddress = async (addressId) => {
        try {
            const { data } = await api.delete(`/auth/address/${addressId}`);
            setUser({ ...user, addresses: data.addresses });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete address',
            };
        }
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
