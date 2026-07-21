import { Search, Bell, UserCircle2 } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="flex items-center justify-between bg-white p-5 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-lg w-96">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search reports..."
          className="bg-transparent outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell className="text-gray-600" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-2">
          <UserCircle2 className="w-10 h-10 text-blue-600" />
          <div>
            <h3 className="font-semibold">Shalini</h3>
            <p className="text-sm text-gray-500">Patient</p>
          </div>
        </div>
      </div>
    </header>
  );
}