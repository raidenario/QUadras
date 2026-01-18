import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        loadStorageData();
    }, []);

    async function loadStorageData() {
        try {
            const storagedUser = await AsyncStorage.getItem('@playtime:user');
            const storagedToken = await AsyncStorage.getItem('@playtime:token');

            if (storagedUser && storagedToken) {
                api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
                setUser(JSON.parse(storagedUser));
            }
        } catch (error) {
            console.log('Error loading storage data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });

            // Verificando estrutura da resposta baseada no Postman
            // { data: { token: "...", user: { ... } } }
            const { token, user } = response.data.data;

            setUser(user);

            api.defaults.headers.Authorization = `Bearer ${token}`;

            await AsyncStorage.setItem('@playtime:user', JSON.stringify(user));
            await AsyncStorage.setItem('@playtime:token', token);
            return { success: true };
        } catch (error) {
            console.log("Login Error", error);
            const message = error.response?.data?.error || error.response?.data?.message || 'Erro ao realizar login';
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }

    async function register(userData) {
        setLoading(true);
        try {
            // O backend espera { user: { ... } }
            const response = await api.post('/auth/register', { user: userData });
            const { token, user } = response.data.data;

            setUser(user);
            api.defaults.headers.Authorization = `Bearer ${token}`;

            await AsyncStorage.setItem('@playtime:user', JSON.stringify(user));
            await AsyncStorage.setItem('@playtime:token', token);
            return { success: true };
        } catch (error) {
            console.log("Register Error", error);
            const message = error.response?.data?.error || error.response?.data?.message || 'Erro ao realizar cadastro';
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }

    function enterAsGuest() {
        setIsGuest(true);
    }

    async function logout() {
        setUser(null);
        setIsGuest(false);
        api.defaults.headers.Authorization = null;
        await AsyncStorage.removeItem('@playtime:user');
        await AsyncStorage.removeItem('@playtime:token');
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, isGuest, login, register, logout, enterAsGuest, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
