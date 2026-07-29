import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarCheck, CheckCircle2, XCircle, FileText, Activity, CreditCard, RefreshCcw, MessageSquare, User, Trash2, Check } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";

const initialNotifications = [
  {
    id: 1,
    type: "Consultations",
    icon: <CalendarCheck size={20} className="text-blue-500" />,
    iconBg: "bg-blue-50",
    title: "Consultation Booked",
    description: "Your consultation with Dr. Priya Verma has been successfully booked for 02 Jun, 10:00 AM.",
    timestamp: "10 mins ago",
    unread: true,
  },
  {
    id: 2,
    type: "Consultations",
    icon: <CheckCircle2 size={20} className="text-emerald-500" />,
    iconBg: "bg-emerald-50",
    title: "Consultation Approved",
    description: "Dr. Arjun Mehta has approved your consultation request.",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "Reports",
    icon: <FileText size={20} className="text-purple-500" />,
    iconBg: "bg-purple-50",
    title: "Report Analyzed",
    description: "Your blood test report has been analyzed by your doctor.",
    timestamp: "5 hours ago",
    unread: false,
  },
  {
    id: 4,
    type: "Reports",
    icon: <Activity size={20} className="text-indigo-500" />,
    iconBg: "bg-indigo-50",
    title: "AI Analysis Completed",
    description: "Your recent MRI scan AI analysis is complete. View your health score.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    type: "Payments",
    icon: <CreditCard size={20} className="text-emerald-500" />,
    iconBg: "bg-emerald-50",
    title: "Payment Successful",
    description: "Payment of ₹1000 for consultation was successful. Invoice available.",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 6,
    type: "Messages",
    icon: <MessageSquare size={20} className="text-blue-500" />,
    iconBg: "bg-blue-50",
    title: "New Message",
    description: "Dr. Priya Verma sent you a new message regarding your prescription.",
    timestamp: "2 days ago",
    unread: false,
  },
  {
    id: 7,
    type: "System",
    icon: <User size={20} className="text-gray-500" />,
    iconBg: "bg-gray-100",
    title: "Profile Updated",
    description: "Your personal details have been successfully updated.",
    timestamp: "3 days ago",
    unread: false,
  },
  {
    id: 8,
    type: "Payments",
    icon: <RefreshCcw size={20} className="text-orange-500" />,
    iconBg: "bg-orange-50",
    title: "Refund Processed",
    description: "Your refund of ₹800 has been initiated and will reflect in 3-5 days.",
    timestamp: "4 days ago",
    unread: false,
  },
  {
    id: 9,
    type: "Consultations",
    icon: <XCircle size={20} className="text-red-500" />,
    iconBg: "bg-red-50",
    title: "Consultation Cancelled",
    description: "Your consultation with Dr. Rohan was cancelled.",
    timestamp: "1 week ago",
    unread: false,
  },
];

const TABS = ["All", "Unread", "Consultations", "Reports", "Payments", "Messages", "System"];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("All");

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return n.unread;
    return n.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />
      <div className="ml-64 p-8 flex flex-col min-h-screen">
        <TopNavbar />

        <div className="mt-8 max-w-5xl mx-auto w-full flex-1">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Notifications</h1>
              <p className="text-gray-500 text-sm mt-1">
                Stay updated with your consultations, reports, payments, and doctor activities.
              </p>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 text-[13px] font-semibold text-[#0D6EFD] bg-white border border-gray-200 rounded-xl hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Check size={16} />
                  Mark All as Read
                </button>
                <button 
                  onClick={handleClearAll}
                  className="px-4 py-2 text-[13px] font-semibold text-red-600 bg-white border border-gray-200 rounded-xl hover:bg-red-50 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          {notifications.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-colors border ${
                    activeTab === tab
                      ? "bg-[#0D6EFD] text-white border-[#0D6EFD] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Notifications List or Empty State */}
          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center justify-center text-center mt-6 min-h-[400px]">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Bell size={40} className="text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No notifications yet</h3>
              <p className="text-gray-500 text-base mt-2 max-w-sm mb-8">
                We'll notify you whenever something important happens.
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3.5 bg-[#0D6EFD] text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-sm text-[15px]"
              >
                Go to Dashboard
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center mt-6">
              <p className="text-gray-500">No notifications found for "{activeTab}".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`bg-white rounded-[16px] p-5 border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                    notif.unread ? "border-blue-200 shadow-[0_4px_12px_rgba(13,110,253,0.06)]" : "border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.iconBg}`}>
                      {notif.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-[15px] font-bold ${notif.unread ? "text-gray-900" : "text-gray-700"}`}>
                          {notif.title}
                        </h3>
                        {notif.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                        )}
                      </div>
                      <p className={`text-[13px] leading-relaxed mb-2 ${notif.unread ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                        {notif.description}
                      </p>
                      <span className="text-[12px] text-gray-400 font-medium">
                        {notif.timestamp}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:mt-0 mt-2 sm:ml-0 ml-16">
                    {notif.unread && (
                      <button 
                        onClick={() => handleMarkRead(notif.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger relative group"
                        title="Mark as Read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(notif.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors tooltip-trigger relative group"
                      title="Delete Notification"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
