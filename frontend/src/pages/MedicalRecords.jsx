import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../hooks/useAuth";
import reportService from "../services/reportService";
import { FileText, Download, Trash2, Plus, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MedicalRecords() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await reportService.getReports(user.id);
      setReports(data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.friendlyMessage || "Failed to load medical records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user?.id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      setLoading(true);
      await reportService.deleteReport(id);
      await fetchReports();
    } catch (err) {
      alert(err.response?.data?.message || err.friendlyMessage || "Failed to delete report.");
      setLoading(false);
    }
  };

  const handleDownload = async (id, fileName) => {
    try {
      const response = await reportService.downloadReport(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || `report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download report.");
    }
  };

  const handleAnalyze = (id) => {
    navigate(`/ai-analysis?report_id=${id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          </div>
          
          <button 
            onClick={() => navigate("/upload-report")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition"
          >
            <Plus size={18} />
            Upload Report
          </button>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Your Reports</h2>
            <button 
              onClick={() => navigate("/analysis-history")} 
              className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-2"
            >
              <Brain size={16} /> View Analysis History
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading Records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Report Title</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Size</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No medical records found.
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{report.report_title}</p>
                            <p className="text-xs text-gray-400">{report.file_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {report.report_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(report.uploaded_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatSize(report.file_size)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => handleAnalyze(report.id)}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-semibold transition flex items-center gap-1"
                              title="Analyze with AI"
                            >
                              <Brain size={16} /> Analyze
                            </button>
                            <button 
                              onClick={() => handleDownload(report.id, report.file_name)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(report.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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
