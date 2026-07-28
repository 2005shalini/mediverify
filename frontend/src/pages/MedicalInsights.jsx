import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { CheckCircle2, Loader2, HeartPulse, Activity, Brain, ArrowLeft, Pill, Salad, Settings } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import aiService from "../services/aiService";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function MedicalInsights() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const reportId = new URLSearchParams(location.search).get("report_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (!reportId || !user?.id) return;
    
    const fetchOrGenerateInsights = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Ensure insights are generated first (if already generated, this just returns success)
        await aiService.generateInsights(reportId);
        const data = await aiService.getMedicalInsights(reportId);
        
        setInsights(data);
      } catch (err) {
        setError(err.response?.data?.message || err.friendlyMessage || "Failed to load medical insights. Please ensure the report was analyzed first.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrGenerateInsights();
  }, [reportId, user?.id]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 50) return "bg-amber-50 border-amber-200";
    return "bg-red-50 border-red-200";
  };

  if (!reportId) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] font-sans">
        <Sidebar />
        <div className="ml-64 p-8 flex items-center justify-center h-full">
          <p className="text-gray-500 font-medium">No report selected. Please go back to Medical Records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8 flex flex-col min-h-screen">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-500 hover:bg-gray-100 transition shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <HeartPulse className="text-pink-600" /> Deep Medical Insights
              </h1>
              <p className="text-sm font-medium text-gray-500 mt-1">Advanced AI Health Diagnostics for Report #{reportId}</p>
            </div>
          </div>
          
          {!loading && !error && (
            <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-bold border border-pink-200">
              <CheckCircle2 size={16} /> Insights Generated
            </div>
          )}
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 mt-12">
            <div className="relative flex justify-center items-center">
              <div className="w-24 h-24 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin absolute"></div>
              <HeartPulse size={32} className="text-pink-500 animate-pulse" />
            </div>
            <p className="mt-8 text-lg text-gray-700 font-medium">Generating deep medical insights...</p>
            <p className="mt-2 text-sm text-gray-500">Cross-referencing parameters with global health standards.</p>
          </div>
        ) : insights ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className={`rounded-2xl p-8 border text-center shadow-sm ${getScoreBg(insights.health_score)}`}>
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Overall Health Score</h2>
                <div className={`text-6xl font-black ${getScoreColor(insights.health_score)} mb-2`}>
                  {insights.health_score}<span className="text-3xl">/100</span>
                </div>
                <p className="text-gray-700 text-sm font-medium">
                  Risk Level: <strong className="uppercase">{insights.risk_level}</strong>
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-blue-500" /> Executive Summary
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {insights.summary || "No summary available."}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended Actions</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Recommended Specialist</p>
                    <p className="text-sm font-semibold text-gray-900">{insights.specialist || "General Physician"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Follow-up In</p>
                    <p className="text-sm font-semibold text-gray-900">{insights.follow_up_days ? `${insights.follow_up_days} Days` : "As directed by doctor"}</p>
                  </div>
                  {insights.tests && insights.tests.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Suggested Tests</p>
                      <div className="flex flex-wrap gap-2">
                        {insights.tests.map((test, idx) => (
                          <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md border border-purple-100">
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column (Lifestyle, Diet, Exercise) */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Settings size={20} className="text-indigo-500" /> Lifestyle Recommendations
                </h2>
                {insights.lifestyle && insights.lifestyle.length > 0 ? (
                  <ul className="space-y-3">
                    {insights.lifestyle.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{idx + 1}</div>
                        <span className="text-gray-700 text-sm leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No specific lifestyle recommendations generated.</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Salad size={20} className="text-emerald-500" /> Diet Plan
                  </h2>
                  {insights.diet && insights.diet.length > 0 ? (
                    <ul className="space-y-3">
                      {insights.diet.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                          <span className="text-emerald-500 mt-0.5">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No diet restrictions identified.</p>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Activity size={20} className="text-orange-500" /> Exercise Plan
                  </h2>
                  {insights.exercise && insights.exercise.length > 0 ? (
                    <ul className="space-y-3">
                      {insights.exercise.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
                          <span className="text-orange-500 mt-0.5">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No specific exercise routine provided.</p>
                  )}
                </div>
              </div>

              {insights.reminders && insights.reminders.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Pill size={20} className="text-pink-500" /> Medication Alerts
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {insights.reminders.map((rem, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{rem}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
