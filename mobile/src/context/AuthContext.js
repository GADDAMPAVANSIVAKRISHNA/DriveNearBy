import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { MOCK_USER } from '../constants/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(MOCK_USER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = await authService.checkStoredSession();
        if (stored) {
          setUser(stored);
        } else {
          setUser(MOCK_USER); // Default logged-in user for effortless demo
        }
      } catch (err) {
        setUser(MOCK_USER);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const loginUser = async (email, password) => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (name, email, phone, password) => {
    setIsLoading(true);
    try {
      const newUser = await authService.register(name, email, phone, password);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, loginUser, registerUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
