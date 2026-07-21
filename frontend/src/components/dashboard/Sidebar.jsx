import { LayoutDashboard, FileText, Stethoscope, Users, MessageSquare, Bell, User, Settings, LogOut, CheckCircle } from "lucide-react";

export default function Sidebar() {
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
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-sm shadow-blue-200"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <Stethoscope size={20} />
            My Consultations
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <FileText size={20} />
            Reports
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <Users size={20} />
            Doctors
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <MessageSquare size={20} />
            Messages
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <Bell size={20} />
            Notifications
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <User size={20} />
            My Profile
          </a>

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <Settings size={20} />
            Settings
          </a>
        </nav>
      </div>

      <div className="p-4 mb-4">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-red-600 transition-colors font-medium"
        >
          <LogOut size={20} />
          Logout
        </a>
      </div>
    </aside>
  );
}