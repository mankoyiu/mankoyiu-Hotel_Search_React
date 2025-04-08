import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', userData.username);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    }
  }, []);

  const login = (userData: User) => {
    console.log('Login successful for user:', userData.username);
    // Store both username and password for Basic Auth
    const authData = {
      ...userData,
      password: userData.password // Make sure password is included
    };
    setUser(authData);
    localStorage.setItem('user', JSON.stringify(authData));
  };

  const logout = () => {
    console.log('Logging out user');
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
