import { Search, Bell } from "lucide-react";

export default function TopNavbar() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Good Morning, Shalini <span>👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's your health overview</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Search size={20} className="text-gray-400" />
        </div>
        
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
             <img src="https://ui-avatars.com/api/?name=Shalini+Verma&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}