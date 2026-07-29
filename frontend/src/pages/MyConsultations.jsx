import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, Clock, ChevronRight } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { useAuth } from "../hooks/useAuth";
import consultationService from "../services/consultationService";

export default function MyConsultations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        if (user && user.id) {
          const data = await consultationService.getPatientHistory(user.id);
          setConsultations(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch consultations:", err);
        setError("Unable to load consultations at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const getStatusColor = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "pending") return "bg-orange-100 text-orange-700";
    if (s === "accepted") return "bg-blue-100 text-blue-700";
    if (s === "completed") return "bg-emerald-100 text-emerald-700";
    if (s === "rejected" || s === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />
      <div className="ml-64 p-8 flex flex-col min-h-screen">
        <TopNavbar />

        <div className="mt-8 max-w-5xl mx-auto w-full flex-1">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight">My Consultations</h1>
            <p className="text-gray-500 text-sm mt-1">
              View and manage all your past and upcoming consultations.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl mb-6 shadow-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((skel) => (
                <div key={skel} className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm animate-pulse flex items-center justify-between">
                   <div className="flex gap-4">
                     <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                     <div className="space-y-2 py-1">
                       <div className="h-4 bg-gray-200 rounded w-32"></div>
                       <div className="h-3 bg-gray-200 rounded w-24"></div>
                     </div>
                   </div>
                   <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : consultations.length === 0 && !error ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center mt-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                <FileText size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No consultations found</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm mb-8">
                You haven't booked any consultations yet. Once you book an appointment with a doctor, it will appear here.
              </p>
              <button 
                onClick={() => navigate('/doctors')}
                className="px-6 py-3 bg-[#0D6EFD] text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
              >
                Find a Doctor
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((cons) => (
                <div 
                  key={cons.id}
                  onClick={() => navigate(`/consultation-details?id=${cons.id}`)}
                  className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-gray-100">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(cons.doctor_name || 'Doctor')}&background=0D8ABC&color=fff`} alt="Doctor" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-gray-900 mb-1">
                        {cons.doctor_name || "Unassigned Doctor"}
                      </h3>
                      <div className="flex items-center gap-4 text-[13px] text-gray-500">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {cons.preferred_date || "N/A"}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {cons.preferred_time || "N/A"}</span>
                      </div>
                      <p className="text-gray-600 text-[13px] mt-2 line-clamp-1 max-w-md">
                        <span className="font-semibold">Symptom:</span> {cons.symptoms || "General"} — {cons.problem_description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                    <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide uppercase ${getStatusColor(cons.status)}`}>
                      {cons.status}
                    </span>
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
