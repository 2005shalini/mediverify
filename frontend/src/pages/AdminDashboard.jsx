import AdminSidebar from "../components/dashboard/AdminSidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { Users, Stethoscope, Activity, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Patients", value: "12,450", change: "+15%", icon: <Users size={24} />, color: "bg-blue-100 text-blue-600" },
    { label: "Verified Doctors", value: "842", change: "+5%", icon: <Stethoscope size={24} />, color: "bg-emerald-100 text-emerald-600" },
    { label: "Active Consultations", value: "1,204", change: "+22%", icon: <Activity size={24} />, color: "bg-purple-100 text-purple-600" },
    { label: "Platform Revenue", value: "$45,200", change: "+18%", icon: <TrendingUp size={24} />, color: "bg-amber-100 text-amber-600" },
  ];

  const recentApprovals = [
    { id: 1, doctor: "Dr. Arvind Mehta", specialty: "Neurology", status: "Pending", time: "2 hours ago" },
    { id: 2, doctor: "Dr. Priya Sharma", specialty: "Cardiology", status: "Approved", time: "5 hours ago" },
    { id: 3, doctor: "Dr. Robert Chen", specialty: "Oncology", status: "Approved", time: "1 day ago" },
    { id: 4, doctor: "Dr. Alisha Khan", specialty: "Pediatrics", status: "Rejected", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <AdminSidebar />

      <div className="ml-64 p-8">
        <TopNavbar />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening on MediVerify today.</p>
            </div>
            <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200">
              Generate Report
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Doctor Verification Requests */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Recent Doctor Verifications</h3>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentApprovals.map((req) => (
                    <div key={req.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                          {req.doctor.charAt(4)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{req.doctor}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{req.specialty} • Submitted {req.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {req.status === "Pending" && (
                          <>
                            <button className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                              Approve
                            </button>
                            <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === "Approved" && (
                          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 size={14} /> Approved
                          </span>
                        )}
                        {req.status === "Rejected" && (
                          <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                            <AlertCircle size={14} /> Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: System Status */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">System Health</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">API Uptime</span>
                      <span className="font-bold text-emerald-600">99.9%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "99.9%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Server Load</span>
                      <span className="font-bold text-blue-600">42%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Storage Usage</span>
                      <span className="font-bold text-amber-600">78%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <Activity className="text-blue-600 mt-0.5" size={20} />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">All systems operational</h4>
                      <p className="text-xs text-blue-700 mt-1">Last checked 2 mins ago. No ongoing issues detected.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
