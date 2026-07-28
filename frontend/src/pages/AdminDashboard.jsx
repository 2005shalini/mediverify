import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/dashboard/AdminSidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { Users, Stethoscope, Activity, TrendingUp, AlertCircle, CheckCircle2, FileText, CreditCard } from "lucide-react";
import adminService from "../services/adminService";
import { useAuth } from "../hooks/useAuth";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [statsData, setStatsData] = useState(null);
  const [pendingDocs, setPendingDocs] = useState([]);
  const [sysHealth, setSysHealth] = useState(null);
  const [consultations, setConsultations] = useState(null);
  const [payments, setPayments] = useState(null);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, docsRes, sysRes, cnsRes, payRes, repRes] = await Promise.all([
          adminService.getDashboard(),
          adminService.getPendingDoctors(),
          adminService.getSystemSummary(),
          adminService.getConsultations(),
          adminService.getPayments(),
          adminService.getReports()
        ]);
        
        setStatsData(dashRes);
        setPendingDocs(docsRes || []);
        setSysHealth(sysRes);
        setConsultations(cnsRes);
        setPayments(payRes);
        setReports(repRes);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.role === "admin") {
      fetchData();
    } else {
      setError("Unauthorized access. Admin only.");
      setLoading(false);
    }
  }, [user]);

  const handleVerify = async (doctorId) => {
    try {
      await adminService.verifyDoctor(doctorId);
      setPendingDocs(docs => docs.filter(d => d.id !== doctorId));
    } catch (err) {
      alert("Failed to verify doctor: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (doctorId) => {
    try {
      await adminService.rejectDoctor(doctorId);
      setPendingDocs(docs => docs.filter(d => d.id !== doctorId));
    } catch (err) {
      alert("Failed to reject doctor: " + (err.response?.data?.message || err.message));
    }
  };

  const stats = [
    { label: "Total Patients", value: statsData?.total_patients || "0", change: "+15%", icon: <Users size={24} />, color: "bg-blue-100 text-blue-600" },
    { label: "Verified Doctors", value: statsData?.verified_doctors || "0", change: "+5%", icon: <Stethoscope size={24} />, color: "bg-emerald-100 text-emerald-600" },
    { label: "Active Consultations", value: statsData?.active_consultations || "0", change: "+22%", icon: <Activity size={24} />, color: "bg-purple-100 text-purple-600" },
    { label: "Platform Revenue", value: `₹${statsData?.platform_revenue || "0"}`, change: "+18%", icon: <TrendingUp size={24} />, color: "bg-amber-100 text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <AdminSidebar />

      <div className="ml-64 p-8 flex flex-col min-h-screen">
        <TopNavbar />

        <div className="mt-8 flex-1">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name}! Here's what's happening on MediVerify today.</p>
            </div>
            <button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-200">
              Generate Report
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
              <AlertCircle size={20} /> <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading Dashboard Data...</p>
            </div>
          ) : (
            <>
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

              {/* Analytics Sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Consultation Analytics */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={18} className="text-purple-600" /> Consultation Analytics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pending</span>
                      <span className="font-bold text-gray-900">{consultations?.pending || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Accepted</span>
                      <span className="font-bold text-emerald-600">{consultations?.accepted || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-bold text-blue-600">{consultations?.completed || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cancelled/Rejected</span>
                      <span className="font-bold text-red-600">{consultations?.rejected || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Analytics */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard size={18} className="text-amber-600" /> Payment Analytics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Successful Payments</span>
                      <span className="font-bold text-emerald-600">{payments?.successful_count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pending Payments</span>
                      <span className="font-bold text-orange-600">{payments?.pending_count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Refunded Payments</span>
                      <span className="font-bold text-purple-600">{payments?.refunded_count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-bold text-gray-900">₹{payments?.total_revenue || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Report Analytics */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" /> Report Analytics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Reports</span>
                      <span className="font-bold text-gray-900">{reports?.total_reports || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Recent Uploads</span>
                      <span className="font-bold text-blue-600">{reports?.recent_uploads || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Blood Tests</span>
                      <span className="font-bold text-gray-900">{reports?.categories?.blood || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Scans/Imaging</span>
                      <span className="font-bold text-gray-900">{reports?.categories?.scans || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Doctor Verification Requests */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900">Pending Doctor Verifications</h3>
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                        View All
                      </button>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {pendingDocs.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No pending verification requests.</div>
                      ) : (
                        pendingDocs.map((req) => (
                          <div key={req.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                {req.full_name?.charAt(0) || "D"}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{req.full_name}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{req.specialization || "General"} • License: {req.license_number}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleVerify(req.id)}
                                className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 border border-emerald-200 transition"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleReject(req.id)}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 border border-red-200 transition"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))
                      )}
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
                          <span className="font-medium text-gray-700">Total Users</span>
                          <span className="font-bold text-emerald-600">{sysHealth?.total_users || 0}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "99.9%" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Total Reports Uploaded</span>
                          <span className="font-bold text-blue-600">{sysHealth?.total_reports || 0}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Total Consultations</span>
                          <span className="font-bold text-amber-600">{sysHealth?.total_consultations || 0}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: "100%" }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-3">
                        <Activity className="text-blue-600 mt-0.5" size={20} />
                        <div>
                          <h4 className="text-sm font-semibold text-blue-900">All systems operational</h4>
                          <p className="text-xs text-blue-700 mt-1">Live from backend. No ongoing issues detected.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
