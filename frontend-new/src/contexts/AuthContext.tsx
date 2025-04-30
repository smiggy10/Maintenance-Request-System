import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'maintenance';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      const response = await api.post('/auth/register', {
        name: `${userData.firstName} ${userData.lastName}`,
        username: userData.email.split('@')[0], // Use email prefix as username
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password,
      });

      if (response.status === 201) {
        // Registration successful
        return;
      }
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Special case for admin login
      if (email === 'admin@mrs.com' && password === 'mrs12345') {
        const adminUser = {
          id: 1,
          name: 'Admin',
          email: 'admin@mrs.com',
          role: 'admin' as const,
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('token', 'admin-token');
        return;
      }

      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token && response.data.user) {
        const userData = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', response.data.token);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 