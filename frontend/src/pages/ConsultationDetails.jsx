import Sidebar from "../components/dashboard/Sidebar";
import { FileText, Star, Clock } from "lucide-react";

export default function ConsultationDetails() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Consultation Details</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Status:</span>
            <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-bold">
              In Review
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (AI Summary, Key Findings, Reports) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">AI Summary</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                The report indicates high cholesterol levels and mild alteration in coronary arteries. ECG shows normal sinus rhythm. Patient is currently on medication for blood pressure.
              </p>

              <h3 className="text-md font-bold text-gray-900 mt-8 mb-4">Key Findings</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span>Total Cholesterol: 240 mg/dL <span className="text-red-500 font-semibold">(High)</span></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span>LDL: 160 mg/dL <span className="text-red-500 font-semibold">(High)</span></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span>HDL: 40 mg/dL <span className="text-green-500 font-semibold">(Normal)</span></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span>Triglycerides: 180 mg/dL <span className="text-orange-500 font-semibold">(Borderline)</span></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                  <span>Blood Pressure: 130/85 mmHg</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Uploaded Reports (4)</h2>
                <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">View All</a>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Prescription.pdf", size: "2.5 MB" },
                  { name: "Blood Report.pdf", size: "1.2 MB" },
                  { name: "ECHO Report.pdf", size: "3.4 MB" },
                  { name: "ECHO Report.pdf", size: "2.1 MB" }
                ].map((report, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2 hover:border-blue-400 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center mb-2 group-hover:bg-red-100">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 truncate" title={report.name}>{report.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{report.size}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (Doctor info, Timer) */}
          <div className="space-y-6">
            
            {/* Doctor Info */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Your Doctor</h2>
              
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                  <img src="https://ui-avatars.com/api/?name=Arjun+Mehta&background=random&color=fff" alt="Dr. Arjun Mehta" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    Dr. Arjun Mehta
                  </h3>
                  <p className="text-gray-500 text-xs font-medium mt-1">Cardiologist</p>
                  <p className="text-gray-400 text-xs mt-1">15 Years Experience</p>
                  <p className="text-gray-400 text-xs mt-1">AIIMS, New Delhi</p>
                  
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-gray-900">4.8</span>
                    <span className="text-xs text-gray-400">(262)</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-white border border-gray-200 text-blue-600 hover:bg-slate-50 font-semibold py-3 rounded-xl transition-colors text-sm">
                View Profile
              </button>
            </div>

            {/* Expected Response Timer */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Clock size={100} />
              </div>
              <h2 className="text-sm font-bold text-gray-500 mb-6 relative z-10">Expected Response</h2>
              
              <div className="flex items-center justify-center gap-4 relative z-10">
                <div>
                  <div className="text-3xl font-bold text-gray-900">02</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Hours</div>
                </div>
                <div className="text-2xl text-gray-300 font-light pb-4">:</div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">15</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Minutes</div>
                </div>
                <div className="text-2xl text-gray-300 font-light pb-4">:</div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">30</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Seconds</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
