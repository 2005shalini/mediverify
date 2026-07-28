import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import StatsCards from "../components/dashboard/StatsCards";
import RecentConsultations from "../components/dashboard/RecentConsultations";
import QuickActions from "../components/dashboard/QuickActions";
import { useAuth } from "../hooks/useAuth";
import patientService from "../services/patientService";

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await patientService.getDashboard(user.id);
        setDashboardData(data);
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

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <TopNavbar />

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
            <div className="mt-2">
              <StatsCards data={dashboardData?.statistics} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RecentConsultations 
                  consultations={dashboardData?.recent_consultation ? [dashboardData.recent_consultation] : []} 
                />
              </div>
              <div>
                <QuickActions />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}