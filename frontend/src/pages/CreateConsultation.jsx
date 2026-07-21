import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";

export default function CreateConsultation() {
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
            {/* Reusing TopNavbar right side styles for consistency, or just the user profile */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                 <img src="https://ui-avatars.com/api/?name=Shalini+Verma&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
        </header>

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
              
              <div className="flex items-center gap-3 text-gray-400 font-medium">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span>Upload Reports</span>
              </div>
              <div className="w-0.5 h-8 bg-gray-200 ml-4"></div>

              <div className="flex items-center gap-3 text-gray-400 font-medium">
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Disease / Problem Category</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none">
                  <option>Select category</option>
                  <option>Cardiology</option>
                  <option>Dermatology</option>
                  <option>Neurology</option>
                  <option>Orthopedics</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Your Symptoms</label>
                <textarea 
                  rows="4"
                  placeholder="Write your symptoms in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Since When?</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Treatment Duration</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none">
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
                  placeholder="Enter doctor name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Hospital (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Enter hospital name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md shadow-blue-200 transition-colors flex items-center gap-2">
                Next: Upload Reports <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
