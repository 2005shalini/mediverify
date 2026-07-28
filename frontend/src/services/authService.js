import apiClient from "../api/axios";
import { LOGIN, SIGNUP, USER_PROFILE, ADMIN_LOGIN, ADMIN_PROFILE, ADMIN_LOGOUT } from "../api/endpoints";

/**
 * Helper function to decode JWT token payload in frontend.
 * @param {string} token 
 * @returns {Object|null}
 */
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * Authenticate user or admin with email and password.
 * Retrieves JWT token and fetches user profile details including ID and Role.
 * @param {Object} credentials { email, password }
 * @returns {Promise<{ token: string, user: Object }>}
 */
export const login = async (credentials) => {
  let token = null;
  let isAdmin = false;
  let adminData = null;
  let loginResData = null;

  // Try normal user login first, unless email explicitly looks like admin
  if (credentials.email && credentials.email.toLowerCase().includes("admin")) {
    try {
      const adminRes = await apiClient.post(ADMIN_LOGIN, credentials);
      token = adminRes.data?.token;
      adminData = adminRes.data?.admin;
      isAdmin = true;
    } catch (err) {
      // If admin login fails with 404, fallback to try normal user login
      if (err.response?.status !== 404) {
        throw err;
      }
    }
  }

  // If not logged in as admin yet, perform normal user login
  if (!token) {
    try {
      const res = await apiClient.post(LOGIN, credentials);
      token = res.data?.token;
      loginResData = res.data;
    } catch (err) {
      // If normal login fails with 404 and we haven't tried admin login yet, try admin login as fallback
      if (err.response?.status === 404 && !isAdmin) {
        const adminRes = await apiClient.post(ADMIN_LOGIN, credentials);
        token = adminRes.data?.token;
        adminData = adminRes.data?.admin;
        isAdmin = true;
      } else {
        throw err;
      }
    }
  }

  if (!token) {
    throw new Error("Authentication failed: No token received from server.");
  }

  const decoded = parseJwt(token);
  let profileData = null;

  // Fetch full user/admin profile using the newly acquired token
  try {
    if (isAdmin || decoded?.admin_id || decoded?.role === "Super Admin" || decoded?.role === "Admin") {
      const profileRes = await apiClient.get(ADMIN_PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      profileData = profileRes.data?.admin || profileRes.data;
    } else {
      const profileRes = await apiClient.get(USER_PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      profileData = profileRes.data?.user || profileRes.data;
    }
  } catch (profileErr) {
    console.warn("Could not fetch extended profile, using JWT payload:", profileErr);
  }

  const role = profileData?.role || decoded?.role || (isAdmin ? "Admin" : "Patient");
  const userId = profileData?.id || decoded?.user_id || decoded?.admin_id || decoded?.id || 1;
  const name = profileData?.full_name || profileData?.name || adminData?.name || loginResData?.user?.full_name || credentials.email.split("@")[0];

  const userObj = {
    id: userId,
    full_name: profileData?.full_name || profileData?.name || adminData?.name || loginResData?.user?.full_name || credentials.email.split("@")[0],
    name: name,
    email: profileData?.email || adminData?.email || credentials.email,
    role: role
  };

  return { token, user: userObj };
};

/**
 * Register a new user account.
 * @param {Object} data { name, email, password, role }
 * @returns {Promise<Object>}
 */
export const signup = async (data) => {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role || "Patient"
  };
  const response = await apiClient.post(SIGNUP, payload);
  return response.data;
};

/**
 * Log out user/admin session.
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Optionally notify server if admin endpoint is available
    await apiClient.post(ADMIN_LOGOUT).catch(() => {});
  } catch (e) {
    // Ignore network errors during logout
  }
  return Promise.resolve();
};

export default {
  login,
  signup,
  logout
};
