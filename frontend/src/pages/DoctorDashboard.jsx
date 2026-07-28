import React, { useState, useEffect } from "react";
import DoctorSidebar from "../components/dashboard/DoctorSidebar";
import { Search, Bell } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import doctorService from "../services/doctorService";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await doctorService.getDashboard(user.id);
        setDashboardData(data);
        setError("");
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        const status = err.response?.status;
        const serverMsg = err.response?.data?.message || err.friendlyMessage;
        
        if (status === 401) {
          setError(serverMsg || "Session expired. Please log in again.");
        } else if (status === 403) {
          setError(serverMsg || "Access denied.");
        } else if (status === 404) {
          setError(serverMsg || "Dashboard data not found.");
        } else if (status >= 500) {
          setError(serverMsg || "Server error occurred. Please try again later.");
        } else {
          setError(serverMsg || "Failed to load dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [user?.id]);

  const avatarName = encodeURIComponent(user?.name || "Doctor");

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <DoctorSidebar />

      <div className="ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Welcome, {user?.name || "Doctor"} <span>👋</span>
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-gray-400" />
            </div>
            
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              {/* <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span> */}
            </button>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                 <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0D8ABC&color=fff`} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading Dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-2">Today's Cases</p>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-bold text-blue-600">{dashboardData?.["Today's Cases"] || 0}</h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-2">Pending Reviews</p>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-bold text-orange-500">{dashboardData?.["Pending Reviews"] || 0}</h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-2">Completed Today</p>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-bold text-emerald-500">{dashboardData?.["Completed Today"] || 0}</h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-2">Monthly Earnings</p>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">₹{dashboardData?.["Monthly Earnings"]?.toLocaleString("en-IN") || 0}</h2>
                </div>
              </div>
            </div>

            {/* Pending Cases Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Upcoming Consultations</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">Patient</th>
                      <th className="px-6 py-4 font-medium">Problem</th>
                      <th className="px-6 py-4 font-medium">Date & Time</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {!dashboardData?.["Upcoming Consultations"] || dashboardData?.["Upcoming Consultations"].length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                          No upcoming consultations found.
                        </td>
                      </tr>
                    ) : (
                      dashboardData["Upcoming Consultations"].map((c, index) => (
                        <tr key={index} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {c.patient_name || c.patient_email || "Unknown"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            Consultation #{c.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {c.appointment_date} {c.appointment_time}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              c.status === "Pending" ? "text-orange-600 bg-orange-50" : "text-emerald-600 bg-emerald-50"
                            }`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
