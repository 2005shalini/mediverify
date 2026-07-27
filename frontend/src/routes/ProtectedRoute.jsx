import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * ProtectedRoute utility component to guard authenticated routes.
 * Prepared for Phase 8 Part 2 integration without modifying existing routes in Part 1.
 */
export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? children : <Outlet />;
}
