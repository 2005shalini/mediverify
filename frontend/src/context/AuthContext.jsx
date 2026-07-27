import React, { createContext, useState, useEffect, useCallback } from "react";
import { getToken, saveToken, removeToken, getUser, saveUser } from "../utils/token";

export const AuthContext = createContext(null);

/**
 * Authentication Provider to manage global auth state across the React app.
 * Handles session restoration, JWT expiration verification, and auto logout.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Logout function: clears local storage, resets state, and redirects to login page
  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
    if (
      typeof window !== "undefined" &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/" &&
      window.location.pathname !== "/signup"
    ) {
      window.location.replace("/login");
    }
  }, []);

  // Initialize authentication state from localStorage on component mount
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken) {
      // Check JWT token expiration
      try {
        const base64Url = storedToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const decoded = JSON.parse(jsonPayload);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          // Invalid or expired token -> Logout automatically
          removeToken();
          setTokenState(null);
          setUser(null);
          setLoading(false);
          return;
        }
      } catch (e) {
        // Corrupted token -> Logout automatically
        removeToken();
        setTokenState(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setTokenState(storedToken);
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setLoading(false);
  }, []);

  // Login function: persists token and user data in state and storage
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
