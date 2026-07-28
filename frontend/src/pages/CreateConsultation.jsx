import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { useAuth } from "../hooks/useAuth";
import consultationService from "../services/consultationService";
import { useNavigate } from "react-router-dom";

export default function CreateConsultation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    category: "",
    symptoms: "",
    preferred_date: "",
    preferred_time: "",
    duration: "",
    doctor_name: "",
    hospital: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.category || formData.category === "Select category") return setError("Category is required"), false;
    if (!formData.symptoms.trim()) return setError("Symptoms description is required"), false;
    if (!formData.preferred_date) return setError("Preferred date is required"), false;
    
    // We map duration to something else, or just include it in problem description
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const payload = {
        patient_id: user.id,
        symptoms: formData.category,
        problem_description: `${formData.symptoms}\n\nDuration: ${formData.duration}\nPrevious Doctor: ${formData.doctor_name || 'None'}\nHospital: ${formData.hospital || 'None'}`,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time || "10:00:00", // Fallback if no time picker in UI
        status: "Pending"
      };

      await consultationService.createConsultation(payload);
      
      // Navigate to upload-report on success as per step 2
      navigate(`/upload-report`);
    } catch (err) {
      const msg = err.response?.data?.message || err.friendlyMessage || "Failed to book consultation.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const avatarName = encodeURIComponent(user?.name || "Patient");

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tell us about your health issue
              </h1>
            </div>
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                 <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0D8ABC&color=fff`} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="flex gap-8">
          {/* Steps Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-600 font-semibold">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-blue-200">
                  1
                </div>
                <span>Basic Information</span>
              </div>
              <div className="w-0.5 h-8 bg-gray-200 ml-4"></div>
              
              <div className="flex items-center gap-3 text-gray-400 font-medium opacity-50">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span>Upload Reports</span>
              </div>
              <div className="w-0.5 h-8 bg-gray-200 ml-4"></div>

              <div className="flex items-center gap-3 text-gray-400 font-medium opacity-50">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span>Review & Submit</span>
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Disease / Problem Category <span className="text-red-500">*</span></label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none"
                >
                  <option>Select category</option>
                  <option>Cardiology</option>
                  <option>Dermatology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                  <option>General Physician</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Your Symptoms <span className="text-red-500">*</span></label>
                <textarea 
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Write your symptoms in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  name="preferred_date"
                  value={formData.preferred_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Time</label>
                <input 
                  type="time" 
                  name="preferred_time"
                  value={formData.preferred_time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Treatment Duration</label>
                <select 
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none"
                >
                  <option>Select duration</option>
                  <option>Less than 1 week</option>
                  <option>1-4 weeks</option>
                  <option>1-6 months</option>
                  <option>More than 6 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Doctor (Optional)</label>
                <input 
                  type="text" 
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleInputChange}
                  placeholder="Enter doctor name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Hospital (Optional)</label>
                <input 
                  type="text" 
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  placeholder="Enter hospital name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md shadow-blue-200 transition-colors flex items-center gap-2 disabled:bg-blue-400"
              >
                {loading ? "Submitting..." : "Submit Consultation & Next"} <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
