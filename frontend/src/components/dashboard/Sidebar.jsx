import { LayoutDashboard, FileText, Stethoscope, User, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          MediVerify
        </h1>
      </div>

      <nav className="mt-6 px-4 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600 text-white"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100"
        >
          <FileText size={20} />
          Reports
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100"
        >
          <Stethoscope size={20} />
          Consultations
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100"
        >
          <User size={20} />
          Profile
        </a>

        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100"
        >
          <Settings size={20} />
          Settings
        </a>
      </nav>
    </aside>
  );
}