import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { Edit2, Mail, Phone, Calendar, Droplet } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <TopNavbar />

        {/* Profile Content Container */}
        <div className="bg-white rounded-2xl shadow-sm mt-8 border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-8 px-8 border-b border-gray-100">
            <button className="py-4 text-blue-600 font-semibold border-b-2 border-blue-600 text-sm">
              Profile
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-900 font-medium text-sm transition">
              Medical History
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-900 font-medium text-sm transition">
              Previous Cases
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-900 font-medium text-sm transition">
              Saved Reports
            </button>
            <button className="py-4 text-gray-500 hover:text-gray-900 font-medium text-sm transition">
              Settings
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Personal Info */}
            <div className="lg:col-span-1 border-r border-gray-100 pr-8">
              <div className="flex items-center gap-4">
                <img
                  src="https://i.pravatar.cc/150?img=47"
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Shalini Verma</h2>
                  <span className="inline-block mt-1 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                    Patient
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">shalini.verma@email.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-900">14 Jan 1995</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <Droplet size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Blood Group</p>
                    <p className="text-sm font-medium text-gray-900">O+</p>
                  </div>
                </div>
              </div>

              <button className="mt-8 w-full py-2.5 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-sm">
                <Edit2 size={16} />
                Edit Profile
              </button>
            </div>

            {/* Right Column: Medical Info */}
            <div className="lg:col-span-2 pl-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Medical Information</h3>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Allergies</p>
                  <p className="text-sm font-semibold text-gray-900">None</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Chronic Conditions</p>
                  <p className="text-sm font-semibold text-gray-900">None</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Current Medications</p>
                  <p className="text-sm font-semibold text-gray-900">Amlodipine 5mg (Daily)</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Surgeries</p>
                  <p className="text-sm font-semibold text-gray-900">None</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
