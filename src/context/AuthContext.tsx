import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface User {
  userId?: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextProps {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUserState] = useState<User | null>(null);
 
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
     
      if (!user) {
        try {
          const decodedUser = jwtDecode<User>(token);
          setUserState(decodedUser);
        } catch {
          setUserState(null);
        }
      }
    } else {
      localStorage.removeItem('token');
      setUserState(null);
    }
  }, [token]);

  
  const setUser = (userData: User | null) => {
    setUserState(userData);
  };

  const logout = () => {
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        setToken: setTokenState,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
