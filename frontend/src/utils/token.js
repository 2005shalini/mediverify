const TOKEN_KEY = "mediverify_jwt_token";
const USER_KEY = "mediverify_user_data";

/**
 * Save JWT token to localStorage.
 * @param {string} token 
 */
export const saveToken = (token) => {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve JWT token from localStorage.
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || null;
};

/**
 * Remove JWT token and associated user data from localStorage.
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if a user is currently logged in by verifying token presence.
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  const token = getToken();
  return !!token;
};

/**
 * Save current user profile object to localStorage.
 * @param {Object} user 
 */
export const saveUser = (user) => {
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Retrieve current user profile object from localStorage.
 * @returns {Object|null}
 */
export const getUser = () => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing stored user data from localStorage:", error);
    return null;
  }
};

/**
 * Clear all authentication data from localStorage.
 */
export const clearAuth = () => {
  removeToken();
};
