import React from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Stethoscope, Users, MessageSquare, Bell, User, Settings, LogOut, CreditCard } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../Logo";

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
        <div className="p-6 border-b border-gray-100">
          <Logo />
        </div>

        <nav className="mt-6 px-4 space-y-1">
          <NavLink
            to="/dashboard"
            onClick={(e) => { if (isActive("/dashboard")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <NavLink
            to="/my-consultations"
            onClick={(e) => { if (isActive("/my-consultations")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/my-consultations")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Stethoscope size={20} />
            My Consultations
          </NavLink>

          <NavLink
            to="/medical-records"
            onClick={(e) => { if (isActive("/medical-records") || isActive("/upload-report")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/medical-records") || isActive("/upload-report")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <FileText size={20} />
            Reports
          </NavLink>

          <NavLink
            to="/doctors"
            onClick={(e) => { if (isActive("/doctors")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/doctors")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Users size={20} />
            Doctors
          </NavLink>
          
          <NavLink
            to="/payment-history"
            onClick={(e) => { if (isActive("/payment-history") || isActive("/payment")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/payment-history") || isActive("/payment")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <CreditCard size={20} />
            Payments
          </NavLink>

          <NavLink
            to="/messages"
            onClick={(e) => { if (isActive("/messages")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/messages")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <MessageSquare size={20} />
            Messages
          </NavLink>

          <NavLink
            to="/notifications"
            onClick={(e) => { if (isActive("/notifications")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/notifications")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Bell size={20} />
            Notifications
          </NavLink>

          <NavLink
            to="/profile"
            onClick={(e) => { if (isActive("/profile")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/profile")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <User size={20} />
            My Profile
          </NavLink>

          <NavLink
            to="/settings"
            onClick={(e) => { if (isActive("/settings")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/settings")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Settings size={20} />
            Settings
          </NavLink>
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