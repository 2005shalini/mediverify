import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../hooks/useAuth";
import reportService from "../services/reportService";
import { useNavigate } from "react-router-dom";
import { UploadCloud, X, FileText, Image as ImageIcon } from "lucide-react";

export default function UploadReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError("");

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the 10 MB limit.");
      e.target.value = null;
      return;
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported file type. Allowed types: PDF, PNG, JPG, JPEG.");
      e.target.value = null;
      return;
    }

    setSelectedFile(file);

    // Create preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // PDF preview is just an icon
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    document.getElementById("fileUpload").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!reportTitle.trim()) return setError("Report title is required.");
    if (!reportType) return setError("Report type is required.");
    if (!selectedFile) return setError("Please select a file to upload.");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("patient_id", user.id);
      formData.append("report_title", reportTitle);
      formData.append("report_type", reportType);
      formData.append("file", selectedFile);

      await reportService.uploadReport(formData);
      navigate("/medical-records");
    } catch (err) {
      setError(err.response?.data?.message || err.friendlyMessage || "Failed to upload report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Upload Medical Report</h1>
          <p className="text-gray-500 mt-1">Upload your lab results, prescriptions, or imaging reports.</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Report Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Blood Test, X-Ray"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Report Type <span className="text-red-500">*</span></label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none"
                >
                  <option value="">Select type</option>
                  <option value="Lab Result">Lab Result</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Imaging">Imaging (X-Ray, MRI)</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File <span className="text-red-500">*</span></label>
              
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    id="fileUpload"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <p className="text-gray-900 font-semibold mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF, PNG, JPG or JPEG (max. 10MB)</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <FileText size={24} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={removeFile} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md shadow-blue-200 transition-colors flex items-center gap-2 disabled:bg-blue-400"
              >
                {loading ? "Uploading..." : "Upload Report"} 
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
