import DoctorSidebar from "../components/dashboard/DoctorSidebar";
import { Search, Bell } from "lucide-react";

export default function DoctorDashboard() {
  const pendingCases = [
    {
      patient: "Shalini Verma",
      problem: "High Cholesterol",
      time: "10:30 AM",
      priority: "Normal",
      priorityColor: "text-emerald-600 bg-emerald-50",
    },
    {
      patient: "Rakesh Kumar",
      problem: "Chest Pain",
      time: "11:15 AM",
      priority: "High",
      priorityColor: "text-red-600 bg-red-50",
    },
    {
      patient: "Priya Sharma",
      problem: "Breathlessness",
      time: "12:00 PM",
      priority: "Normal",
      priorityColor: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <DoctorSidebar />

      <div className="ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Welcome, Dr. Arjun Mehta <span>👋</span>
            </h1>
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
                 <img src="https://ui-avatars.com/api/?name=Arjun+Mehta&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Today's Cases</p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-bold text-blue-600">8</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Pending Reviews</p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-bold text-orange-500">5</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Completed Today</p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-bold text-emerald-500">3</h2>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Total earnings</p>
            <div className="flex items-end gap-3">
              <h2 className="text-3xl font-bold text-gray-900">₹6,240</h2>
            </div>
          </div>
        </div>

        {/* Pending Cases Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Pending Cases</h2>
            <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Patient</th>
                  <th className="px-6 py-4 font-medium">Problem</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Priority</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingCases.map((c, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{c.patient}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.problem}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.time}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.priorityColor}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
