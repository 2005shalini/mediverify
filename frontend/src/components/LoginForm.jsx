import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import authService from "../services/authService";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect automatically if user is already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const redirectParams = new URLSearchParams(location.search).get("redirect");
      if (redirectParams) {
        navigate(redirectParams);
        return;
      }
      const role = String(user.role || "").toLowerCase();
      if (role.includes("admin")) {
        navigate("/admin-dashboard");
      } else if (role.includes("doctor")) {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, authLoading, navigate, location]);

  const validateForm = () => {
    if (!email || !email.trim()) {
      setError("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password) {
      setError("Password is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { token, user: userData } = await authService.login({
        email: email.trim(),
        password: password,
      });

      // Store token and update AuthContext
      login(userData, token);

      // Role based redirect
      const redirectParams = new URLSearchParams(location.search).get("redirect");
      if (redirectParams) {
        navigate(redirectParams);
      } else {
        const role = String(userData.role || "").toLowerCase();
        if (role.includes("admin")) {
          navigate("/admin-dashboard");
        } else if (role.includes("doctor")) {
          navigate("/doctor-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.friendlyMessage;

      if (status === 401) {
        setError(serverMsg || "Invalid password or unauthorized access.");
      } else if (status === 404) {
        setError(serverMsg || "User with this email was not found.");
      } else if (status === 403) {
        setError(serverMsg || "Access forbidden. Please contact support.");
      } else if (status >= 500) {
        setError(serverMsg || "Server error occurred. Please try again later.");
      } else {
        setError(serverMsg || "Failed to log in. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center">Login</h2>
      <p className="text-gray-500 text-center mt-2 mb-6">
        Welcome back to MediVerify
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading}
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md shadow-blue-100"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-500">
        Don't have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer font-medium hover:underline"
          onClick={() => {
            if (loading) return;
            const redirectParams = new URLSearchParams(location.search).get("redirect");
            navigate(redirectParams ? `/signup?redirect=${redirectParams}` : "/signup");
          }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}

export default LoginForm;