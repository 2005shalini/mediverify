import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../hooks/useAuth";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const validateForm = () => {
    if (!name || !name.trim()) {
      setError("Full Name is required.");
      return false;
    }
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
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!role) {
      setError("Please select a role.");
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
      const signUpRes = await authService.signup({
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: role,
      });

      let token = signUpRes?.token;
      let userObj = signUpRes?.user;

      if (!token) {
        const loginRes = await authService.login({
          email: email.trim(),
          password: password,
        });
        token = loginRes.token;
        userObj = loginRes.user;
      }

      login(userObj, token);
      
      const userRole = String(userObj?.role || role).toLowerCase();
      const redirectParams = new URLSearchParams(location.search).get("redirect");
      
      if (redirectParams) {
        navigate(redirectParams);
      } else if (userRole === "doctor") {
        navigate("/doctor-dashboard");
      } else if (userRole === "admin" || userRole === "super admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message || err.friendlyMessage;

      if (status === 400) {
        setError(serverMsg || "Invalid registration details provided.");
      } else if (status === 409) {
        setError(serverMsg || "This email is already registered.");
      } else if (status >= 500) {
        setError(serverMsg || "Server error occurred. Please try again later.");
      } else {
        setError(serverMsg || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md my-8">
      <h2 className="text-3xl font-bold text-center">Create Account</h2>
      <p className="text-gray-500 text-center mt-2 mb-6">
        Join MediVerify today
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg flex items-center gap-2">
          <span className="font-semibold">Success!</span> Account created. Redirecting to dashboard...
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block mb-1.5 font-medium text-sm">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            disabled={loading || success}
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
          />
        </div>

        <div>
          <label className="block mb-1.5 font-medium text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={loading || success}
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
          />
        </div>

        <div>
          <label className="block mb-1.5 font-medium text-sm">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading || success}
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed transition bg-white"
          >
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
          </select>
        </div>

        <div>
          <label className="block mb-1.5 font-medium text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password (min 6 chars)"
            disabled={loading || success}
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
          />
        </div>

        <div>
          <label className="block mb-1.5 font-medium text-sm">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            disabled={loading || success}
            className="w-full border rounded-lg p-3 outline-none focus:border-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md shadow-blue-100 mt-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating account...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-500">
        Already have an account?{" "}
        <span
          className="text-blue-600 cursor-pointer font-medium hover:underline"
          onClick={() => {
            if (loading) return;
            const redirectParams = new URLSearchParams(location.search).get("redirect");
            navigate(redirectParams ? `/login?redirect=${redirectParams}` : "/login");
          }}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default SignupForm;