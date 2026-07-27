import React, { createContext, useState, useEffect, useCallback } from "react";
import { getToken, saveToken, removeToken, getUser, saveUser } from "../utils/token";

export const AuthContext = createContext(null);

/**
 * Authentication Provider to manage global auth state across the React app.
 * Prepares structure for Phase 8 Part 2 integration without making API calls yet.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state from localStorage on component mount
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken) {
      setTokenState(storedToken);
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setLoading(false);
  }, []);

  // Logout function: clears local storage and resets state
  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
  }, []);

  // Login function: persists token and user data in state and storage
  // Note: Actual backend API authentication is handled in Phase 8 Part 2
  const login = useCallback((userData, jwtToken) => {
    if (jwtToken) {
      saveToken(jwtToken);
      setTokenState(jwtToken);
    }
    if (userData) {
      saveUser(userData);
      setUser(userData);
    }
  }, []);

  // Listen for global 401 unauthorized events emitted by Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener("mediverify:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("mediverify:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
