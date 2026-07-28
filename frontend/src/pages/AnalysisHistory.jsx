import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../hooks/useAuth";
import aiService from "../services/aiService";
import { Brain, HeartPulse, ChevronRight, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AnalysisHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await aiService.getInsightHistory(user.id);
        setHistory(data || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || err.friendlyMessage || "Failed to load analysis history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id]);

  const getRiskColor = (level) => {
    const l = String(level).toLowerCase();
    if (l.includes("high")) return "bg-red-50 text-red-700 border-red-200";
    if (l.includes("medium")) return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="text-indigo-600" /> AI Analysis History
            </h1>
            <p className="text-gray-500 mt-1">Review your previously generated health insights.</p>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Analyzed Reports</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading History...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Report Title</th>
                    <th className="px-6 py-4 font-medium">Analysis Date</th>
                    <th className="px-6 py-4 font-medium">Health Score</th>
                    <th className="px-6 py-4 font-medium">Risk Level</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No AI analysis history found. Analyze a report first.
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Activity size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{item.report_title || "Unknown Report"}</p>
                            <p className="text-xs text-gray-400">Report #{item.report_id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                            <HeartPulse size={16} className={item.health_score >= 80 ? "text-emerald-500" : item.health_score >= 50 ? "text-amber-500" : "text-red-500"} />
                            {item.health_score}/100
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getRiskColor(item.risk_level)}`}>
                            {item.risk_level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => navigate(`/ai-analysis?report_id=${item.report_id}`)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                          >
                            View <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
