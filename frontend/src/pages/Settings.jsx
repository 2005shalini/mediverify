import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Lock, Bell, Palette, Shield, Trash2, LogOut, AlertTriangle, X, User, CheckCircle2 } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { useAuth } from "../hooks/useAuth";
import patientService from "../services/patientService";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "Prefer not to say",
    address: ""
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    consultationUpdates: true,
    reportNotifications: true,
    aiAnalysis: true,
    paymentUpdates: true,
    doctorMessages: true,
    promotional: false
  });

  const [appearance, setAppearance] = useState("System Default");

  const [privacy, setPrivacy] = useState({
    showProfileToDoctors: true,
    allowAiReports: true
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      // Load initial profile data
      setProfile(prev => ({
        ...prev,
        full_name: user?.full_name || user?.name || "",
        email: user?.email || "",
      }));
      // Fetch full profile from API if needed
      patientService.getProfile(user?.id)
        .then(data => {
          setProfile({
            full_name: data?.full_name || user?.full_name || user?.name || "",
            email: data?.email || user?.email || "",
            phone: data?.phone || "",
            date_of_birth: data?.date_of_birth || "",
            gender: data?.gender || "Prefer not to say",
            address: data?.address || ""
          });
        })
        .catch(err => console.error("Could not fetch profile", err));
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  const handleToggle = (setter, state, key) => {
    setter({ ...state, [key]: !state[key] });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await patientService.updateProfile({
        user_id: user?.id,
        full_name: profile?.full_name,
        phone: profile?.phone,
        date_of_birth: profile?.date_of_birth,
        gender: profile?.gender,
        address: profile?.address
      });
      setSuccessMsg("Account settings saved successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    // Mocking password update success
    setSuccessMsg("Password updated successfully.");
    setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    // Mocking account deletion
    logout();
    navigate("/login");
  };

  const ToggleSwitch = ({ label, isChecked, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-[14px] text-gray-700 font-medium">{label}</span>
      <button 
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${isChecked ? "bg-[#0D6EFD]" : "bg-gray-200"}`}
      >
        <span className={`w-4 h-4 bg-white rounded-full transition-transform transform ${isChecked ? "translate-x-5" : "translate-x-0"}`}></span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />
      <div className="ml-64 p-8 flex flex-col min-h-screen">
        <TopNavbar />

        <div className="mt-8 max-w-4xl w-full flex-1">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your account preferences, security, and notifications.
            </p>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 size={18} /> {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-sm font-medium">
              <AlertTriangle size={18} /> {errorMsg}
            </div>
          )}

          <div className="space-y-6 pb-12">
            
            {/* Account Settings */}
            <div className="bg-white rounded-[16px] p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                <User size={20} className="text-[#0D6EFD]" />
                <h2 className="text-[16px] font-bold text-gray-900">Account Settings</h2>
              </div>
              
              <form onSubmit={saveProfile} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" name="full_name" value={profile.full_name} onChange={handleProfileChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input type="email" name="email" value={profile.email} readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900" placeholder="+91" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Date of Birth</label>
                    <input type="date" name="date_of_birth" value={profile.date_of_birth} onChange={handleProfileChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Gender</label>
                    <select name="gender" value={profile.gender} onChange={handleProfileChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Address</label>
                    <input type="text" name="address" value={profile.address} onChange={handleProfileChange} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900" placeholder="Street, City, Zip" />
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" disabled={loading} className="px-6 py-2.5 bg-[#0D6EFD] text-white text-[14px] font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                    <Save size={16} /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Security */}
            <div className="bg-white rounded-[16px] p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-6">
                <Lock size={20} className="text-[#0D6EFD]" />
                <h2 className="text-[16px] font-bold text-gray-900">Security</h2>
              </div>
              
              <form onSubmit={updatePassword} className="max-w-md space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Current Password</label>
                  <input type="password" name="currentPassword" value={security.currentPassword} onChange={handleSecurityChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">New Password</label>
                  <input type="password" name="newPassword" value={security.newPassword} onChange={handleSecurityChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={security.confirmPassword} onChange={handleSecurityChange} required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900" />
                </div>
                <div className="pt-2">
                  <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-[14px] font-semibold rounded-xl hover:bg-black transition-colors shadow-sm">
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Notifications */}
              <div className="bg-white rounded-[16px] p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
                  <Bell size={20} className="text-[#0D6EFD]" />
                  <h2 className="text-[16px] font-bold text-gray-900">Notifications</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  <ToggleSwitch label="Consultation Updates" isChecked={notifications.consultationUpdates} onChange={() => handleToggle(setNotifications, notifications, 'consultationUpdates')} />
                  <ToggleSwitch label="Report Notifications" isChecked={notifications.reportNotifications} onChange={() => handleToggle(setNotifications, notifications, 'reportNotifications')} />
                  <ToggleSwitch label="AI Analysis Completed" isChecked={notifications.aiAnalysis} onChange={() => handleToggle(setNotifications, notifications, 'aiAnalysis')} />
                  <ToggleSwitch label="Payment Updates" isChecked={notifications.paymentUpdates} onChange={() => handleToggle(setNotifications, notifications, 'paymentUpdates')} />
                  <ToggleSwitch label="Doctor Messages" isChecked={notifications.doctorMessages} onChange={() => handleToggle(setNotifications, notifications, 'doctorMessages')} />
                  <ToggleSwitch label="Promotional Emails" isChecked={notifications.promotional} onChange={() => handleToggle(setNotifications, notifications, 'promotional')} />
                </div>
              </div>

              <div className="space-y-6">
                {/* Appearance */}
                <div className="bg-white rounded-[16px] p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                    <Palette size={20} className="text-[#0D6EFD]" />
                    <h2 className="text-[16px] font-bold text-gray-900">Appearance</h2>
                  </div>
                  <div className="space-y-4">
                    {["Light Mode", "Dark Mode", "System Default"].map(mode => (
                      <label key={mode} className="flex items-center gap-3 cursor-pointer">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${appearance === mode ? 'border-[#0D6EFD]' : 'border-gray-300'}`}>
                          {appearance === mode && <div className="w-2.5 h-2.5 rounded-full bg-[#0D6EFD]"></div>}
                        </div>
                        <span className="text-[14px] text-gray-700 font-medium">{mode}</span>
                        <input type="radio" className="hidden" name="appearance" value={mode} checked={appearance === mode} onChange={(e) => setAppearance(e.target.value)} />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Privacy */}
                <div className="bg-white rounded-[16px] p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
                    <Shield size={20} className="text-[#0D6EFD]" />
                    <h2 className="text-[16px] font-bold text-gray-900">Privacy</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    <ToggleSwitch label="Show Profile to Doctors" isChecked={privacy.showProfileToDoctors} onChange={() => handleToggle(setPrivacy, privacy, 'showProfileToDoctors')} />
                    <ToggleSwitch label="Allow AI to use reports for better recommendations" isChecked={privacy.allowAiReports} onChange={() => handleToggle(setPrivacy, privacy, 'allowAiReports')} />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-[16px] p-8 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-[16px] font-bold text-gray-900">Account Actions</h2>
                  <p className="text-[13px] text-gray-500 mt-1">Manage your session or permanently delete your account data.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleLogout} className="px-5 py-2.5 text-[14px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                  <button onClick={() => setShowDeleteModal(true)} className="px-5 py-2.5 text-[14px] font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2">
                    <Trash2 size={16} /> Delete Account
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[20px] shadow-xl w-full max-w-md p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900">Delete Account</h3>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 text-[14px] mb-6 leading-relaxed">
              Are you sure you want to permanently delete your account? All of your data, consultations, and reports will be removed. This action <strong>cannot</strong> be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="px-5 py-2.5 text-[14px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 text-[14px] font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
