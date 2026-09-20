import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { DEMO_USER } from '../services/mockData';
import { authLogin, authRegister } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (data: { name: string; email: string; password: string }) => Promise<void>;
  loginDemoUser: () => Promise<void>;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session
    const savedUser = localStorage.getItem('finpilot_user');
    const savedToken = localStorage.getItem('finpilot_token');
    const wasLoggedOut = localStorage.getItem('finpilot_logged_out');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else if (!wasLoggedOut) {
      // Auto-load demo user session so the dashboard is immediately accessible
      setUser(DEMO_USER);
      localStorage.setItem('finpilot_token', 'mock_token_u001');
      localStorage.setItem('finpilot_user', JSON.stringify(DEMO_USER));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      localStorage.removeItem('finpilot_logged_out');
      const res = await authLogin({ email, password });
      setUser(res.user);
      localStorage.setItem('finpilot_token', res.token);
      localStorage.setItem('finpilot_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authRegister(data);
      setUser(res.user);
      localStorage.setItem('finpilot_token', res.token);
      localStorage.setItem('finpilot_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoUser = async () => {
    await login('demo@finpilot.com', '123456');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finpilot_token');
    localStorage.removeItem('finpilot_user');
    localStorage.setItem('finpilot_logged_out', 'true');
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...profile };
    setUser(updated);
    localStorage.setItem('finpilot_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        registerUser,
        loginDemoUser,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
