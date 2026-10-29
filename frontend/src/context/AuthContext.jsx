import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { setAccessToken, clearAccessToken } from '../utils/tokenUtils';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session via refresh-token on load
  const initAuth = useCallback(async () => {
    try {
      const res = await authService.refreshToken();
      if (res.data.success && res.data.accessToken) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      }
    } catch (err) {
      // User is not logged in / no refresh token
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
      clearAccessToken();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [initAuth]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.data.success) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    return res.data;
  };

  const verifyEmail = async (email, otp) => {
    const res = await authService.verifyEmail(email, otp);
    if (res.data.success) {
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);
    }
    return res.data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  const setAuthToken = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        verifyEmail,
        logout,
        setAuthToken,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
