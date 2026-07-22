import DoctorSidebar from "../components/dashboard/DoctorSidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { UploadCloud, FileText, CheckCircle2, Shield, Info } from "lucide-react";

export default function DoctorVerification() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <DoctorSidebar />

      <div className="ml-64 p-8">
        <TopNavbar />

        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Doctor Verification</h1>
                <p className="text-blue-100 text-sm max-w-lg">
                  To ensure the highest quality of care on MediVerify, please provide your medical credentials. Verification usually takes 24-48 hours.
                </p>
              </div>
              <div className="hidden md:flex w-16 h-16 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm">
                <Shield size={32} className="text-white" />
              </div>
            </div>

            {/* Status Alert */}
            <div className="p-6 border-b border-gray-100 bg-blue-50/50">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 mt-0.5" size={20} />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">Verification Pending</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your profile will be hidden from patients until your credentials are successfully verified by our admin team.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <form className="space-y-8">
                
                {/* Professional Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                    Professional Credentials
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medical License Number</label>
                      <input 
                        type="text" 
                        placeholder="e.g. MED-12345-89" 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State Medical Council</label>
                      <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-600">
                        <option>Select Medical Council</option>
                        <option>Delhi Medical Council</option>
                        <option>Maharashtra Medical Council</option>
                        <option>Karnataka Medical Council</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year of Registration</label>
                      <input 
                        type="number" 
                        placeholder="YYYY" 
                        className="w-full md:w-1/2 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Document Uploads */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                    Document Uploads
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ID Proof Upload */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-white transition-all shadow-sm">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Government ID Proof</h4>
                      <p className="text-xs text-gray-500 mb-4">Aadhar, Passport, or Driving License (PDF, JPG)</p>
                      <button type="button" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
                        <UploadCloud size={16} /> Browse Files
                      </button>
                    </div>

                    {/* Medical Degree Upload */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-white transition-all shadow-sm">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Medical Degree/Certificate</h4>
                      <p className="text-xs text-gray-500 mb-4">MBBS, MD, or equivalent certificate (PDF)</p>
                      <button type="button" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
                        <UploadCloud size={16} /> Browse Files
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-4 pt-4">
                  <button type="button" className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-all">
                    Save Draft
                  </button>
                  <button type="button" className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Submit for Verification
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
