import { LayoutDashboard, Users, CheckSquare, Calendar, DollarSign, User, LogOut, CheckCircle } from "lucide-react";

export default function DoctorSidebar() {
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

          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-slate-50 hover:text-blue-600 transition-colors font-medium"
          >
            <User size={20} />
            Profile
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
