import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Stethoscope, Users, MessageSquare, Bell, User, Settings, LogOut, CheckCircle, CreditCard } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <div className="text-blue-600">
            <CheckCircle size={24} className="text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            MediVerify
          </h1>
        </div>

        <nav className="mt-6 px-4 space-y-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/my-consultations"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/my-consultations")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Stethoscope size={20} />
            My Consultations
          </Link>

          <Link
            to="/medical-records"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/medical-records") || isActive("/upload-report")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <FileText size={20} />
            Reports
          </Link>

          <Link
            to="/doctors"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/doctors")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Users size={20} />
            Doctors
          </Link>
          
          <Link
            to="/payment-history"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/payment-history") || isActive("/payment")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <CreditCard size={20} />
            Payments
          </Link>

          <Link
            to="/messages"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/messages")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <MessageSquare size={20} />
            Messages
          </Link>

          <Link
            to="/notifications"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/notifications")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Bell size={20} />
            Notifications
          </Link>

          <Link
            to="/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/profile")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <User size={20} />
            My Profile
          </Link>

          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/settings")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Settings size={20} />
            Settings
          </Link>
        </nav>
      </div>

      <div className="p-4 mb-4">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-red-600 transition-colors font-medium cursor-pointer text-left"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}