import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DoctorSidebar from "../components/dashboard/DoctorSidebar";
import { FileText, Star, Clock, Link as LinkIcon, Edit2, Save, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import consultationService from "../services/consultationService";
import { useLocation } from "react-router-dom";

export default function ConsultationDetails() {
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const consultationId = searchParams.get("id");

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Doctor Action States
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  
  const [isEditingPrescription, setIsEditingPrescription] = useState(false);
  const [prescription, setPrescription] = useState("");

  const [isEditingLink, setIsEditingLink] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");

  const fetchDetails = async () => {
    if (!consultationId) return;
    try {
      setLoading(true);
      const data = await consultationService.getConsultation(consultationId);
      setDetails(data);
      setNotes(data.doctor_notes || "");
      setPrescription(data.prescription || "");
      setMeetingLink(data.meeting_link || "");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.friendlyMessage || "Failed to load consultation details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [consultationId]);

  const handleStatusUpdate = async (status) => {
    try {
      setActionLoading(true);
      await consultationService.updateStatus(consultationId, status.toLowerCase());
      await fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setActionLoading(true);
      await consultationService.addDoctorNotes(consultationId, notes);
      await fetchDetails();
      setIsEditingNotes(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save notes.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSavePrescription = async () => {
    try {
      setActionLoading(true);
      await consultationService.addPrescription(consultationId, prescription);
      await fetchDetails();
      setIsEditingPrescription(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save prescription.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveLink = async () => {
    try {
      setActionLoading(true);
      await consultationService.addMeetingLink(consultationId, meetingLink);
      await fetchDetails();
      setIsEditingLink(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save meeting link.");
    } finally {
      setActionLoading(false);
    }
  };

  const SidebarComponent = user?.role === "Doctor" ? DoctorSidebar : Sidebar;
  const isDoctor = user?.role === "Doctor";

  const getStatusColor = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "pending") return "bg-orange-100 text-orange-700";
    if (s === "accepted") return "bg-blue-100 text-blue-700";
    if (s === "completed") return "bg-emerald-100 text-emerald-700";
    if (s === "rejected" || s === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  if (!consultationId) {
    return (
      <div className="min-h-screen bg-[#F4F7FE] font-sans">
        <SidebarComponent />
        <div className="ml-64 p-8 flex items-center justify-center">
          <p className="text-gray-500 font-medium">No consultation selected. Invalid URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <SidebarComponent />

      <div className="ml-64 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading details...</p>
          </div>
        ) : details && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Consultation #{details.id}</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500">Status:</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(details.status)}`}>
                  {details.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (Details) */}
              <div className="lg:col-span-2 space-y-6">
                
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Patient Complaint</h2>
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md">
                      {details.symptoms || "General"}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                    {details.problem_description}
                  </p>

                  <h3 className="text-md font-bold text-gray-900 mt-8 mb-4">Preferred Schedule</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {details.preferred_date || "N/A"} <br/>
                    <strong>Time:</strong> {details.preferred_time || "N/A"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                    Doctor Notes
                    {isDoctor && details.status !== "Cancelled" && (
                      <button onClick={() => setIsEditingNotes(!isEditingNotes)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition-colors">
                        {isEditingNotes ? <X size={16} /> : <Edit2 size={16} />}
                      </button>
                    )}
                  </h2>
                  
                  {isEditingNotes ? (
                    <div className="space-y-3">
                      <textarea 
                        className="w-full border rounded-lg p-3 text-sm" 
                        rows="4" 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Type notes here..."
                      ></textarea>
                      <button onClick={handleSaveNotes} disabled={actionLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Notes</button>
                    </div>
                  ) : (
                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                      {details.doctor_notes || "No notes provided yet."}
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                    Prescription
                    {isDoctor && !["Cancelled", "Rejected"].includes(details.status) && (
                      <button onClick={() => setIsEditingPrescription(!isEditingPrescription)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition-colors">
                        {isEditingPrescription ? <X size={16} /> : <Edit2 size={16} />}
                      </button>
                    )}
                  </h2>
                  
                  {isEditingPrescription ? (
                    <div className="space-y-3">
                      <textarea 
                        className="w-full border rounded-lg p-3 text-sm" 
                        rows="4" 
                        value={prescription} 
                        onChange={(e) => setPrescription(e.target.value)}
                        placeholder="Type prescription here..."
                      ></textarea>
                      <button onClick={handleSavePrescription} disabled={actionLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Prescription</button>
                    </div>
                  ) : (
                    <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                      {details.prescription || "No prescription provided yet."}
                    </p>
                  )}
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-6">
                
                {/* Person Info (Doctor or Patient) */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                    {isDoctor ? "Patient Info" : "Your Doctor"}
                  </h2>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(isDoctor ? (details.patient_name || "Patient") : (details.doctor_name || "Doctor"))}&background=random&color=fff`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {isDoctor ? (details.patient_name || `Patient ID: ${details.patient_id}`) : (details.doctor_name || "Unassigned")}
                      </h3>
                      {!isDoctor && details.doctor_specialization && (
                        <p className="text-gray-500 text-xs font-medium mt-1">{details.doctor_specialization}</p>
                      )}
                      {isDoctor && details.patient_email && (
                        <p className="text-gray-500 text-xs font-medium mt-1">{details.patient_email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meeting Link */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                    Meeting Link
                    {isDoctor && !["Cancelled", "Rejected", "Completed"].includes(details.status) && (
                      <button onClick={() => setIsEditingLink(!isEditingLink)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition-colors">
                        {isEditingLink ? <X size={16} /> : <Edit2 size={16} />}
                      </button>
                    )}
                  </h2>
                  
                  {isEditingLink ? (
                    <div className="space-y-3">
                      <input 
                        type="url"
                        className="w-full border rounded-lg p-3 text-sm" 
                        value={meetingLink} 
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                      />
                      <button onClick={handleSaveLink} disabled={actionLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Link</button>
                    </div>
                  ) : (
                    <div>
                      {details.meeting_link ? (
                        <a href={details.meeting_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 font-semibold hover:underline text-sm break-all">
                          <LinkIcon size={16} /> {details.meeting_link}
                        </a>
                      ) : (
                        <p className="text-gray-500 text-sm">No meeting link provided.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Doctor Actions */}
                {isDoctor && details.status === "Pending" && (
                  <div className="flex gap-4">
                    <button onClick={() => handleStatusUpdate("accept")} disabled={actionLoading} className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition">Accept</button>
                    <button onClick={() => handleStatusUpdate("reject")} disabled={actionLoading} className="flex-1 bg-red-50 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-100 transition">Reject</button>
                  </div>
                )}
                {isDoctor && details.status === "Accepted" && (
                  <div className="flex gap-4">
                    <button onClick={() => handleStatusUpdate("complete")} disabled={actionLoading} className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition">Mark as Completed</button>
                  </div>
                )}

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
