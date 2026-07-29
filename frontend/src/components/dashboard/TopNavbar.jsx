import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, User, Settings, FileText, LogOut, X, Check, Activity, Search as SearchIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const MOCK_SEARCH_DATA = [
  { id: 1, type: "Doctor", title: "Dr. Priya Verma", subtitle: "Cardiologist", link: "/doctors" },
  { id: 2, type: "Doctor", title: "Dr. Arjun Mehta", subtitle: "Neurologist", link: "/doctors" },
  { id: 3, type: "Specialization", title: "Cardiology", subtitle: "Heart Specialists", link: "/doctors" },
  { id: 4, type: "Report", title: "Blood Test Results", subtitle: "Uploaded yesterday", link: "/medical-records" },
  { id: 5, type: "Consultation", title: "Consultation with Dr. Priya", subtitle: "Upcoming tomorrow", link: "/my-consultations" },
  { id: 6, type: "Message", title: "New message from Dr. Arjun", subtitle: "Check prescription", link: "/messages" },
  { id: 7, type: "Payment", title: "Invoice #1024", subtitle: "Paid ₹1000", link: "/payment-history" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Consultation Booked", text: "Dr. Priya Verma - 02 Jun", time: "10 mins ago", unread: true },
  { id: 2, title: "Consultation Approved", text: "Your appointment is confirmed.", time: "1 hour ago", unread: true },
  { id: 3, title: "Report Uploaded", text: "Blood Test Results are ready", time: "2 hours ago", unread: false },
  { id: 4, title: "Payment Successful", text: "Paid ₹1000 for consultation", time: "Yesterday", unread: false },
  { id: 5, title: "Reminder", text: "Upcoming consultation in 2 hours", time: "Yesterday", unread: false },
];

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  const displayName = user?.full_name || user?.name || user?.username || "Shalini";
  const displayEmail = user?.email || "patient@mediverify.com";
  const avatarName = encodeURIComponent(displayName);

  // Unread count
  const unreadCount = notifications.filter(n => n.unread).length;

  // Filter search
  const filteredSearch = MOCK_SEARCH_DATA.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target) && isSearchOpen) setIsSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target) && isNotifOpen) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target) && isProfileOpen) setIsProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen, isNotifOpen, isProfileOpen]);

  // Esc to close search
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotifOpen(false);
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus search
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMarkRead = (e, id) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleNavigation = (path) => {
    setIsSearchOpen(false);
    setIsNotifOpen(false);
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="flex items-center justify-between mb-8 relative">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Good Morning, {displayName} <span>👋</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's your health overview</p>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Search Icon & Modal */}
        <div ref={searchRef}>
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-400 hover:text-[#0D6EFD] hover:bg-blue-50 rounded-full transition-colors cursor-pointer"
          >
            <Search size={20} />
          </button>

          {isSearchOpen && (
            <div className="absolute top-14 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <SearchIcon size={18} className="text-gray-400" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, reports..." 
                  className="w-full bg-transparent text-sm focus:outline-none text-gray-900 placeholder-gray-400"
                />
                <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredSearch.length === 0 ? (
                  <div className="p-6 text-center text-gray-500 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  filteredSearch.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => handleNavigation(item.link)}
                      className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors flex flex-col gap-0.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[14px] font-bold text-gray-900">{item.title}</span>
                        <span className="text-[11px] font-semibold text-[#0D6EFD] bg-blue-50 px-2 py-0.5 rounded-md">{item.type}</span>
                      </div>
                      <span className="text-[12px] text-gray-500">{item.subtitle}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Notifications Icon & Panel */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-full transition-colors cursor-pointer ${isNotifOpen ? 'bg-blue-50 text-[#0D6EFD]' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute top-14 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all flex flex-col">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-[15px]">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-[#0D6EFD] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[12px] font-semibold text-[#0D6EFD] hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <Bell size={32} className="text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm font-medium">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => handleNavigation('/notifications')}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${notif.unread ? 'bg-blue-50/30' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.unread ? 'bg-[#0D6EFD]' : 'bg-transparent'}`}></div>
                        <div className="flex-1">
                          <h4 className={`text-[14px] ${notif.unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{notif.title}</h4>
                          <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{notif.text}</p>
                          <span className="text-[11px] text-gray-400 font-medium mt-1.5 block">{notif.time}</span>
                        </div>
                        {notif.unread && (
                          <button 
                            onClick={(e) => handleMarkRead(e, notif.id)}
                            className="text-gray-300 hover:text-[#0D6EFD] p-1 h-fit rounded tooltip-trigger"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-100 text-center">
                <button onClick={() => handleNavigation('/notifications')} className="text-[13px] font-semibold text-[#0D6EFD] hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div ref={profileRef} className="relative">
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 cursor-pointer p-1 rounded-full transition-colors ${isProfileOpen ? 'ring-2 ring-blue-100 bg-blue-50' : 'hover:bg-gray-50'}`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
               <img src={`https://ui-avatars.com/api/?name=${avatarName}&background=0D8ABC&color=fff`} alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute top-14 right-0 w-64 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <p className="font-bold text-gray-900 text-[15px] truncate">{displayName}</p>
                <p className="text-[13px] text-gray-500 truncate">{displayEmail}</p>
              </div>
              <div className="p-2 space-y-1">
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-gray-700 hover:text-[#0D6EFD] hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <User size={18} /> My Profile
                </button>
                <button 
                  onClick={() => handleNavigation('/settings')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-gray-700 hover:text-[#0D6EFD] hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Settings size={18} /> Settings
                </button>
                <button 
                  onClick={() => handleNavigation('/profile?tab=medical-history')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-gray-700 hover:text-[#0D6EFD] hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Activity size={18} /> Medical History
                </button>
              </div>
              <div className="p-2 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}