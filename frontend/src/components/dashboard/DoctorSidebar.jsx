import React from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CheckSquare, Calendar, DollarSign, User, LogOut, CheckCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function DoctorSidebar() {
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
          <NavLink
            to="/doctor-dashboard"
            onClick={(e) => { if (isActive("/doctor-dashboard")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/doctor-dashboard")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <Users size={20} />
            My Cases
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <CheckSquare size={20} />
            Completed
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <Calendar size={20} />
            Schedule
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <DollarSign size={20} />
            Earnings
          </a>

          <NavLink
            to="/doctor-profile"
            onClick={(e) => { if (isActive("/doctor-profile")) e.preventDefault(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive("/doctor-profile")
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <User size={20} />
            Profile
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
