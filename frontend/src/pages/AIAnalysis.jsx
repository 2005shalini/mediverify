import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { CheckCircle2, Loader2, Circle, Bot, AlertTriangle, ArrowRight, Brain } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import aiService from "../services/aiService";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function AIAnalysis() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const reportId = new URLSearchParams(location.search).get("report_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!reportId || !user?.id) return;
    
    const fetchOrAnalyze = async () => {
      try {
        setLoading(true);
        setError("");
        
        // This will either fetch existing or create new analysis if not analyzed
        await aiService.analyzeReport(reportId, user.id);
        const data = await aiService.getAnalysis(reportId);
        
        setAnalysis(data);
      } catch (err) {
        setError(err.response?.data?.message || err.friendlyMessage || "Failed to analyze report.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrAnalyze();
  }, [reportId, user?.id]);

  const getRiskColor = (level) => {
    const l = String(level).toLowerCase();
    if (l.includes("high")) return "bg-red-100 text-red-700";
    if (l.includes("medium")) return "bg-orange-100 text-orange-700";
    return "bg-emerald-100 text-emerald-700";
  };

  if (!reportId) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] font-sans">
        <Sidebar />
        <div className="ml-64 p-8 flex items-center justify-center h-full">
          <p className="text-gray-500 font-medium">No report selected for analysis. Please go back to Medical Records.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8 flex flex-col min-h-screen">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Analysis Failed:</span> {error}
          </div>
        )}

        {loading ? (
          <>
            <header className="mb-12">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Loader2 className="animate-spin text-blue-600" /> AI is Analysing Your Report
              </h1>
              <p className="text-gray-500 mt-2">This may take a few moments...</p>
            </header>

            <div className="flex-1 flex items-center justify-center -mt-20">
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex items-center gap-24 w-full max-w-4xl">
                
                <div className="flex-1 flex justify-center items-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-blue-50 rounded-full flex justify-center items-center absolute -top-8 -left-8 -z-0 opacity-50 blur-3xl"></div>
                    <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex justify-center items-center shadow-inner relative z-10 border-4 border-white">
                      <Bot size={100} className="text-blue-500 animate-pulse" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4 bg-blue-50 p-3 -ml-3 rounded-xl border border-blue-100">
                    <Loader2 className="text-blue-600 w-6 h-6 flex-shrink-0 animate-spin" />
                    <span className="text-lg font-semibold text-blue-700">Reading Medical Data</span>
                  </div>
                  <div className="flex items-center gap-4 opacity-50">
                    <Circle className="text-gray-300 w-6 h-6 flex-shrink-0" />
                    <span className="text-lg font-medium text-gray-500">Extracting Abnormalities</span>
                  </div>
                  <div className="flex items-center gap-4 opacity-50">
                    <Circle className="text-gray-300 w-6 h-6 flex-shrink-0" />
                    <span className="text-lg font-medium text-gray-500">Generating Summary</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : analysis ? (
          <>
            <header className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="text-indigo-600" /> AI Report Analysis
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-1">Report ID: {analysis.report_id}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-200">
                  <CheckCircle2 size={16} /> Analysis Complete
                </div>
                <button 
                  onClick={() => navigate(`/medical-insights?report_id=${reportId}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-200 transition flex items-center gap-2"
                >
                  Generate Medical Insights <ArrowRight size={18} />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">AI Summary</h2>
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                    {analysis.summary || "No summary generated."}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Detected Abnormalities</h2>
                  {analysis.abnormal_values && analysis.abnormal_values.length > 0 ? (
                    <ul className="space-y-3">
                      {analysis.abnormal_values.map((ab, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <AlertTriangle size={16} className="text-red-500" />
                          {ab}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No significant abnormalities detected in the provided report.</p>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Possible Conditions</h2>
                  {analysis.diseases && analysis.diseases.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysis.diseases.map((d, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No specific conditions identified.</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                  <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Assessed Risk Level</h2>
                  <span className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${getRiskColor(analysis.risk_level)}`}>
                    {analysis.risk_level} Risk
                  </span>
                  <p className="text-xs text-gray-400 mt-4">Based on extracted clinical parameters.</p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Extracted Medicines</h2>
                  {analysis.medicines && analysis.medicines.length > 0 ? (
                    <ul className="space-y-2 list-disc list-inside text-sm text-gray-700">
                      {analysis.medicines.map((m, idx) => (
                        <li key={idx}>{m}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No medicines extracted.</p>
                  )}
                </div>

                <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
                  <h2 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                    <Bot size={20} className="text-indigo-600" /> Recommendations
                  </h2>
                  <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">
                    {analysis.recommendation || "Consult a doctor for detailed advice."}
                  </p>
                </div>

              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
