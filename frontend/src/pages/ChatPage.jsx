import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";

export default function ChatPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />
      <div className="ml-64 p-8 flex flex-col min-h-screen">
        <TopNavbar />

        <div className="mt-8 max-w-5xl mx-auto w-full flex-1">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Messages</h1>
            <p className="text-gray-500 text-sm mt-1">
              Connect and communicate directly with your verified doctors.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center mt-6 min-h-[500px]">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={40} className="text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No conversations yet.</h3>
            <p className="text-gray-500 text-base mt-3 max-w-md mb-8 leading-relaxed">
              Book a consultation to start chatting with your doctor. Your secure messages and medical advice will appear here.
            </p>
            <button 
              onClick={() => navigate('/doctors')}
              className="px-8 py-3.5 bg-[#0D6EFD] text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md shadow-blue-200 flex items-center gap-2 text-[15px]"
            >
              <Users size={20} />
              Find Doctors
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
