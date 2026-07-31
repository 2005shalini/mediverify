import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Star, Clock, GraduationCap, Languages, CalendarCheck, FileText, Activity } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import doctorService from "../services/doctorService";

export default function DoctorProfileView() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getDetails(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error("Failed to fetch doctor details:", err);
        setError("Could not load doctor profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      {isAuthenticated ? <Sidebar /> : <Navbar />}
      <div className={isAuthenticated ? "ml-64 p-8 flex flex-col min-h-screen" : "p-8 flex flex-col min-h-screen max-w-7xl mx-auto"}>
        {isAuthenticated && <TopNavbar />}

        <div className="mt-4 max-w-5xl mx-auto w-full">
          {/* Back Button */}
          <button 
            onClick={() => navigate("/doctors")}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium text-sm mb-6 w-fit"
          >
            <ArrowLeft size={16} />
            Back to Doctors
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm animate-pulse flex flex-col md:flex-row gap-8">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-gray-200 rounded-2xl"></div>
              <div className="flex-1 space-y-4 pt-2">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2 pt-4">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ) : doctor ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Profile Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header Card */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-slate-100 border border-gray-200 shrink-0">
                    {doctor.profile_photo ? (
                      <img src={doctor.profile_photo} alt={doctor.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.full_name || 'Dr')}&background=0D8ABC&color=fff&size=200`} alt="Profile" className="w-full h-full object-cover" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                          {doctor.full_name}
                          {doctor.verification_status === "Approved" && (
                            <Activity size={20} className="text-blue-500 fill-blue-100" />
                          )}
                        </h1>
                        <p className="text-blue-600 font-medium text-lg mt-1">{doctor.specialization}</p>
                        
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap size={16} className="text-gray-400" />
                            <span>{doctor.qualification}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} className="text-gray-400" />
                            <span>{doctor.experience} Years Exp.</span>
                          </div>
                          {doctor.rating && (
                            <div className="flex items-center gap-1.5">
                              <Star size={16} className="text-amber-400 fill-amber-400" />
                              <span className="font-medium text-gray-900">{doctor.rating}</span>
                              <span className="text-gray-400">({doctor.reviews_count || 0} reviews)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About & Details */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">About Doctor</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {doctor.bio || "No biography provided by the doctor yet."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Hospital / Clinic</h4>
                        <p className="text-sm text-gray-500 mt-1">{doctor.hospital || "Independent Practitioner"}</p>
                        {(doctor.city || doctor.state) && (
                          <p className="text-xs text-gray-400 mt-0.5">{[doctor.city, doctor.state].filter(Boolean).join(", ")}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Languages size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Languages Spoken</h4>
                        <p className="text-sm text-gray-500 mt-1">{doctor.languages || "English, Hindi"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <CalendarCheck size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">Availability</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {doctor.availability === "Available" ? (
                            <span className="text-emerald-600 font-medium">Currently Accepting Consultations</span>
                          ) : (
                            <span className="text-red-500 font-medium">Currently Unavailable</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">License Verification</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {doctor.license_number}
                          {doctor.verification_status === "Approved" ? (
                            <span className="ml-2 text-emerald-600 text-xs font-bold">(Verified)</span>
                          ) : (
                            <span className="ml-2 text-amber-500 text-xs font-bold">(Pending Verification)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                   <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Patient Reviews</h3>
                   {doctor.reviews && doctor.reviews.length > 0 ? (
                     <div className="space-y-6">
                       {doctor.reviews.map((rev, idx) => (
                         <div key={idx} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                           <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                 {rev.patient_name?.charAt(0) || "P"}
                               </div>
                               <span className="font-medium text-sm text-gray-900">{rev.patient_name || "Anonymous Patient"}</span>
                             </div>
                             <div className="flex items-center gap-1">
                               <Star size={14} className="text-amber-400 fill-amber-400" />
                               <span className="text-sm font-medium text-gray-700">{rev.rating || 5}.0</span>
                             </div>
                           </div>
                           <p className="text-gray-600 text-sm mt-2 pl-10">{rev.comment || "Great consultation!"}</p>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-8">
                       <Star size={32} className="mx-auto text-gray-200 mb-3" />
                       <p className="text-gray-500 text-sm">No reviews yet for this doctor.</p>
                     </div>
                   )}
                </div>
              </div>

              {/* Right Sidebar - Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg sticky top-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Book Consultation</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">Doctor</span>
                      <span className="font-semibold text-gray-900 text-sm text-right">{doctor.full_name} <br/><span className="text-xs font-normal text-gray-500">({doctor.specialization})</span></span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-500 text-sm">Consultation Fee</span>
                      <span className="font-bold text-lg text-gray-900">₹{doctor.consultation_fee}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-6 text-center">
                    Proceed to select your preferred date and time for the consultation.
                  </p>

                  <button 
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate(`/login?redirect=${encodeURIComponent(`/create-consultation?doctor=${doctor.user_id || doctor.id}`)}`);
                        return;
                      }
                      navigate("/create-consultation", { 
                        state: { 
                          doctorId: doctor.user_id || doctor.id, 
                          doctorName: doctor.full_name, 
                          doctorSpecialization: doctor.specialization, 
                          fee: doctor.consultation_fee 
                        } 
                      });
                    }}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
                  >
                    Continue to Booking
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
