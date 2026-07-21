import Sidebar from "../components/dashboard/Sidebar";
import { CheckCircle2, Loader2, Circle, Bot } from "lucide-react";

export default function AIAnalysis() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8 flex flex-col min-h-screen">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            AI is Analysing Your Reports
          </h1>
          <p className="text-gray-500 mt-2">This may take a few moments</p>
        </header>

        <div className="flex-1 flex items-center justify-center -mt-20">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex items-center gap-24 w-full max-w-4xl">
            
            {/* Robot Graphic Area */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative">
                <div className="w-64 h-64 bg-blue-50 rounded-full flex justify-center items-center absolute -top-8 -left-8 -z-0 opacity-50 blur-3xl"></div>
                <div className="w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex justify-center items-center shadow-inner relative z-10 border-4 border-white">
                  <Bot size={100} className="text-blue-500" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Analysis Steps */}
            <div className="flex-1 space-y-6">
              {/* Completed Steps */}
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-green-500 w-6 h-6 flex-shrink-0" fill="#Edf7ed" />
                <span className="text-lg font-medium text-gray-800">Reading Prescription</span>
              </div>
              
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-green-500 w-6 h-6 flex-shrink-0" fill="#Edf7ed" />
                <span className="text-lg font-medium text-gray-800">Reading Blood Report</span>
              </div>
              
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-green-500 w-6 h-6 flex-shrink-0" fill="#Edf7ed" />
                <span className="text-lg font-medium text-gray-800">Analyzing Scans</span>
              </div>
              
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-green-500 w-6 h-6 flex-shrink-0" fill="#Edf7ed" />
                <span className="text-lg font-medium text-gray-800">Extracting Medicines</span>
              </div>

              {/* In Progress Step */}
              <div className="flex items-center gap-4 bg-blue-50 p-3 -ml-3 rounded-xl border border-blue-100">
                <Loader2 className="text-blue-600 w-6 h-6 flex-shrink-0 animate-spin" />
                <span className="text-lg font-semibold text-blue-700">Generating Summary</span>
              </div>

              {/* Pending Step */}
              <div className="flex items-center gap-4 opacity-50">
                <Circle className="text-gray-300 w-6 h-6 flex-shrink-0" />
                <span className="text-lg font-medium text-gray-500">Finding Best Specialists</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pb-8">
          <p className="text-gray-400 font-medium flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Please don't close this window
          </p>
        </div>
      </div>
    </div>
  );
}
