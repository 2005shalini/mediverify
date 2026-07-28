import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { Edit2, Mail, Phone, Calendar, Droplet, MapPin, User, Save, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import patientService from "../services/patientService";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    blood_group: "",
    date_of_birth: "",
    address: "",
    emergency_contact: ""
  });

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await patientService.getProfile(user.id);
      setProfileData(data);
      setFormData({
        age: data.age || "",
        gender: data.gender || "",
        blood_group: data.blood_group || "",
        date_of_birth: data.date_of_birth ? String(data.date_of_birth).split("T")[0] : "",
        address: data.address || "",
        emergency_contact: data.emergency_contact || ""
      });
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        // Profile might not exist yet, allow creating
        setProfileData({});
      } else {
        const msg = err.response?.data?.message || err.friendlyMessage || "Failed to load profile.";
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
    if (!formData.age || isNaN(formData.age) || formData.age <= 0) {
      setError("Please enter a valid age.");
      return false;
    }
    if (!formData.gender) {
      setError("Gender is required.");
      return false;
    }
    if (!formData.blood_group) {
      setError("Blood Group is required.");
      return false;
    }
    if (!formData.date_of_birth) {
      setError("Date of birth is required.");
      return false;
    }
    if (!formData.address) {
      setError("Address is required.");
      return false;
    }
    if (!formData.emergency_contact || formData.emergency_contact.length < 10) {
      setError("Valid emergency contact is required.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError("");
    if (!validateForm()) return;
    
    try {
      setSaving(true);
      await patientService.updateProfile({
        user_id: user.id,
        ...formData,
        age: parseInt(formData.age, 10)
      });
      await fetchProfile(); // Reload saved data
      setIsEditing(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.friendlyMessage || "Failed to update profile.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const avatarName = encodeURIComponent(user?.name || "Patient");

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <TopNavbar />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm mt-8 border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-8 px-8 border-b border-gray-100">
            <button className="py-4 text-blue-600 font-semibold border-b-2 border-blue-600 text-sm">
              Profile
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-900 font-medium text-sm transition">
              Medical History
            </button>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading Profile...</p>
            </div>
          ) : (
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Personal Info */}
              <div className="lg:col-span-1 border-r border-gray-100 pr-8">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${avatarName}&background=0D8ABC&color=fff`}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.name || "Patient Name"}</h2>
                    <span className="inline-block mt-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      {user?.role || "Patient"}
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
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Emergency Contact</p>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="emergency_contact"
                          value={formData.emergency_contact} 
                          onChange={handleInputChange}
                          className="w-full border rounded p-1 text-sm mt-1" 
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{profileData?.emergency_contact || "N/A"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date of Birth</p>
                      {isEditing ? (
                        <input 
                          type="date" 
                          name="date_of_birth"
                          value={formData.date_of_birth} 
                          onChange={handleInputChange}
                          className="w-full border rounded p-1 text-sm mt-1" 
                        />
                      ) : (
                        <p className="text-sm font-medium text-gray-900">
                          {profileData?.date_of_birth ? new Date(profileData.date_of_birth).toLocaleDateString() : "N/A"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                      <Droplet size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Blood Group</p>
                      {isEditing ? (
                        <select 
                          name="blood_group"
                          value={formData.blood_group} 
                          onChange={handleInputChange}
                          className="w-full border rounded p-1 text-sm mt-1"
                        >
                          <option value="">Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      ) : (
                        <p className="text-sm font-medium text-gray-900">{profileData?.blood_group || "N/A"}</p>
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
                <h3 className="text-lg font-bold text-gray-900 mb-6">Additional Information</h3>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500">Age</p>
                    </div>
                    {isEditing ? (
                      <input 
                        type="number" 
                        name="age"
                        value={formData.age} 
                        onChange={handleInputChange}
                        className="w-full max-w-[150px] border rounded p-1.5 text-sm" 
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{profileData?.age ? `${profileData.age} Years` : "N/A"}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User size={14} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500">Gender</p>
                    </div>
                    {isEditing ? (
                      <select 
                        name="gender"
                        value={formData.gender} 
                        onChange={handleInputChange}
                        className="w-full max-w-[150px] border rounded p-1.5 text-sm"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{profileData?.gender || "N/A"}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={14} className="text-gray-400" />
                      <p className="text-xs font-medium text-gray-500">Residential Address</p>
                    </div>
                    {isEditing ? (
                      <textarea 
                        name="address"
                        value={formData.address} 
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full border rounded p-2 text-sm" 
                      ></textarea>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">{profileData?.address || "N/A"}</p>
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
