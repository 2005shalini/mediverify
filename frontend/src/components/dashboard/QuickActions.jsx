import { Plus, Upload, Search, List } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Plus size={20} />
          </div>
          <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">New Consultation</span>
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Upload size={20} />
          </div>
          <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Upload Reports</span>
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <Search size={20} />
          </div>
          <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Find Doctors</span>
        </button>

        <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <List size={20} />
          </div>
          <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">View All Consultations</span>
        </button>
      </div>
    </div>
  );
}
