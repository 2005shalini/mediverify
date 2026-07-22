import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Activity, Settings, Stethoscope, FileText, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/admin-dashboard" },
    { icon: <Users size={20} />, label: "Patients", path: "/admin-dashboard/patients" },
    { icon: <Stethoscope size={20} />, label: "Doctors", path: "/admin-dashboard/doctors" },
    { icon: <Activity size={20} />, label: "Platform Health", path: "/admin-dashboard/health" },
    { icon: <FileText size={20} />, label: "Reports", path: "/admin-dashboard/reports" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-20">
      <div className="h-20 flex items-center px-8 border-b border-gray-100">
        <Link to="/admin-dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">+</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            MediVerify<span className="text-sm font-medium text-gray-400 ml-1">Admin</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className={`${isActive ? "text-blue-600" : "text-gray-400"}`}>
                {item.icon}
              </div>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
        <Link
          to="/admin-dashboard/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <Settings size={20} className="text-gray-400" />
          Settings
        </Link>
        <button className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all duration-200">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
