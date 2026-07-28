import React, { useState, useEffect } from "react";
import DoctorSidebar from "../components/dashboard/DoctorSidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { Edit2, Mail, Briefcase, Award, Clock, MapPin, User, Save, X, DollarSign, FileText } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import doctorService from "../services/doctorService";

export default function DoctorProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialization: "",
    qualification: "",
    experience: "",
    hospital: "",
    consultation_fee: "",
    city: "",
    state: "",
    bio: "",
    availability: ""
  });

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await doctorService.getProfile(user.id);
      setProfileData(data);
      setFormData({
        specialization: data.specialization || "",
        qualification: data.qualification || "",
        experience: data.experience || "",
        hospital: data.hospital || "",
        consultation_fee: data.consultation_fee || "",
        city: data.city || "",
        state: data.state || "",
        bio: data.bio || "",
        availability: data.availability || "Available"
      });
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        setProfileData({});
      } else {
        const msg = err.response?.data?.message || err.friendlyMessage || "Failed to load doctor profile.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.specialization) return setError("Specialization is required."), false;
    if (!formData.qualification) return setError("Qualification is required."), false;
    if (formData.experience === "" || isNaN(formData.experience) || formData.experience < 0) return setError("Valid experience is required."), false;
    if (!formData.hospital) return setError("Hospital is required."), false;
    if (formData.consultation_fee === "" || isNaN(formData.consultation_fee) || formData.consultation_fee <= 0) return setError("Valid consultation fee is required."), false;
    if (!formData.city) return setError("City is required."), false;
    if (!formData.state) return setError("State is required."), false;
    return true;
  };

  const handleSave = async () => {
    setError("");
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      await doctorService.updateProfile({
        user_id: user.id,
        ...formData,
        experience: parseInt(formData.experience, 10),
        consultation_fee: parseFloat(formData.consultation_fee)
      });
      await fetchProfile();
      setIsEditing(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.friendlyMessage || "Failed to update profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async () => {
    const newStatus = profileData?.availability === "Available" ? "Unavailable" : "Available";
    try {
      await doctorService.updateAvailability(user.id, newStatus);
      await fetchProfile();
    } catch (err) {
      setError("Failed to update availability.");
    }
  };

  const avatarName = encodeURIComponent(user?.name || "Doctor");

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <DoctorSidebar />

      <div className="ml-64 p-8">
        <TopNavbar />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm mt-8 border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-8 border-b border-gray-100">
            <div className="flex items-center gap-8">
              <button className="py-4 text-blue-600 font-semibold border-b-2 border-blue-600 text-sm">
                Doctor Profile
              </button>
            </div>
            
            {!loading && profileData && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <button
                  onClick={toggleAvailability}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profileData.availability === "Available" ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profileData.availability === "Available" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-sm font-semibold ${profileData.availability === "Available" ? "text-emerald-600" : "text-gray-500"}`}>
                  {profileData.availability}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading Doctor Profile...</p>
            </div>
          ) : (
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Personal Info */}
              <div className="lg:col-span-1 border-r border-gray-100 pr-8">
                <div className="flex items-center gap-4">
                  <img
                    src={profileData?.profile_photo || `https://ui-avatars.com/api/?name=${avatarName}&background=0D8ABC&color=fff`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{profileData?.full_name || user?.name || "Doctor Name"}</h2>
                    <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                      {profileData?.specialization || "Specialization"}
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                      <Briefcase size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hospital/Clinic</p>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="hospital"
                          value={formData.hospital} 
                          onChange={handleInputChange}
                          className="w-full border rounded p-1 text-sm mt-1" 
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{profileData?.hospital || "N/A"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                      <DollarSign size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Consultation Fee</p>
                      {isEditing ? (
                        <input 
                          type="number" 
                          name="consultation_fee"
                          value={formData.consultation_fee} 
                          onChange={handleInputChange}
                          className="w-full border rounded p-1 text-sm mt-1" 
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">₹{profileData?.consultation_fee || "0"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="mt-8 w-full py-2.5 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm cursor-pointer"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-2.5 flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm cursor-pointer disabled:bg-blue-400"
                    >
                      {saving ? "Saving..." : <><Save size={16} /> Save</>}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        setError("");
                      }}
                      disabled={saving}
                      className="py-2.5 px-4 flex items-center justify-center border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Other Info */}
              <div className="lg:col-span-2 pl-4">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Professional Details</h3>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={14} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500">Specialization</p>
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="specialization"
                        value={formData.specialization} 
                        onChange={handleInputChange}
                        className="w-full border rounded p-1.5 text-sm" 
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{profileData?.specialization || "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={14} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500">Qualification</p>
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="qualification"
                        value={formData.qualification} 
                        onChange={handleInputChange}
                        className="w-full border rounded p-1.5 text-sm" 
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{profileData?.qualification || "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={14} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500">Experience</p>
                    </div>
                    {isEditing ? (
                      <input 
                        type="number" 
                        name="experience"
                        value={formData.experience} 
                        onChange={handleInputChange}
                        className="w-full border rounded p-1.5 text-sm" 
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{profileData?.experience ? `${profileData.experience} Years` : "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText size={14} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500">License Number</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{profileData?.license_number || "N/A"}</p>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={14} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500">Location (City, State)</p>
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          name="city"
                          placeholder="City"
                          value={formData.city} 
                          onChange={handleInputChange}
                          className="w-1/2 border rounded p-1.5 text-sm" 
                        />
                        <input 
                          type="text" 
                          name="state"
                          placeholder="State"
                          value={formData.state} 
                          onChange={handleInputChange}
                          className="w-1/2 border rounded p-1.5 text-sm" 
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{profileData?.city}, {profileData?.state}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500">Bio</p>
                    </div>
                    {isEditing ? (
                      <textarea 
                        name="bio"
                        value={formData.bio} 
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full border rounded p-2 text-sm" 
                      ></textarea>
                    ) : (
                      <p className="text-sm font-medium text-gray-700">{profileData?.bio || "No bio available."}</p>
                    )}
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
