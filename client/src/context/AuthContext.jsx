import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hosteller_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.token) {
      authAPI.getProfile()
        .then(res => {
          const updated = { ...user, ...res.data };
          setUser(updated);
          localStorage.setItem('hosteller_user', JSON.stringify(updated));
        })
        .catch(err => {
          console.warn('Session check failed or expired');
        });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      setUser(res.data);
      localStorage.setItem('hosteller_user', JSON.stringify(res.data));
      toast.success(`Welcome back, ${res.data.name}!`);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authAPI.register(userData);
      setUser(res.data);
      localStorage.setItem('hosteller_user', JSON.stringify(res.data));
      toast.success(`Account created successfully! Welcome to Hosteller.`);
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hosteller_user');
    toast.success('Logged out successfully.');
  };

  const toggleSaveHostel = async (hostelId) => {
    if (!user) {
      toast.error('Please login to save hostels!');
      return false;
    }
    try {
      const res = await authAPI.toggleSaveHostel(hostelId);
      const updatedSaved = res.data.savedHostels;
      const isSavedNow = updatedSaved.includes(hostelId);
      const updatedUser = { ...user, savedHostels: updatedSaved };
      setUser(updatedUser);
      localStorage.setItem('hosteller_user', JSON.stringify(updatedUser));
      toast.success(isSavedNow ? 'Hostel saved to your bookmarks!' : 'Hostel removed from bookmarks.');
      return isSavedNow;
    } catch (error) {
      toast.error('Failed to update bookmark.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleSaveHostel }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
