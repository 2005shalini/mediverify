import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { Video, MoreVertical, Paperclip, Send, Search } from "lucide-react";

const initialChatList = [
  {
    id: 1,
    name: "Dr. Arjun Mehta",
    role: "Cardiologist",
    time: "10:00 AM",
    avatar: "Arjun+Mehta"
  },
  {
    id: 2,
    name: "Dr. Priya Singh",
    role: "Cardiologist",
    time: "Yesterday",
    avatar: "Priya+Singh"
  },
  {
    id: 3,
    name: "Dr. Rohan Verma",
    role: "Cardiologist",
    time: "12 May",
    avatar: "Rohan+Verma"
  },
  {
    id: 4,
    name: "Support Team",
    role: "Helpdesk",
    time: "10 May",
    avatar: "Support+Team"
  }
];

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState(1);
  const activeChat = initialChatList.find(c => c.id === activeChatId);

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans flex">
      <Sidebar />

      <div className="ml-64 flex-1 flex p-8 h-screen">
        <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden">
          
          {/* Chat List Sidebar */}
          <div className="w-80 border-r border-gray-100 flex flex-col bg-white">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="w-full bg-slate-50 text-sm border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {initialChatList.map((chat) => (
                <div 
                  key={chat.id} 
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${activeChatId === chat.id ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'}`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=${chat.avatar}&background=random&color=fff`} alt={chat.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-sm font-bold truncate ${activeChatId === chat.id ? 'text-blue-900' : 'text-gray-900'}`}>{chat.name}</h3>
                      <span className={`text-xs ${activeChatId === chat.id ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>{chat.time}</span>
                    </div>
                    <p className={`text-xs truncate ${activeChatId === chat.id ? 'text-blue-700/80' : 'text-gray-500'}`}>{chat.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chat Area */}
          <div className="flex-1 flex flex-col bg-[#F9FAFB]">
            
            {/* Chat Header */}
            <div className="px-8 py-6 border-b border-gray-100 bg-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                  <img src={`https://ui-avatars.com/api/?name=${activeChat.avatar}&background=random&color=fff`} alt={activeChat.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Chat with {activeChat.name}</h2>
                  <p className="text-sm text-green-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-blue-600 transition-colors bg-slate-50 p-2 rounded-full">
                  <Video size={20} />
                </button>
                <button className="hover:text-blue-600 transition-colors bg-slate-50 p-2 rounded-full">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 mt-1">
                  <img src={`https://ui-avatars.com/api/?name=${activeChat.avatar}&background=random&color=fff`} alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="bg-white border border-gray-100 text-gray-700 p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-md text-sm">
                    Hi Shalini, I have reviewed your reports.
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">10:00 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 mt-1">
                  <img src="https://ui-avatars.com/api/?name=Shalini+Verma&background=0D8ABC&color=fff" alt="You" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm max-w-md text-sm">
                    Thank you doctor. Should I continue the same medicines?
                  </div>
                  <p className="text-xs text-gray-400 mt-2 mr-1">10:04 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 mt-1">
                  <img src={`https://ui-avatars.com/api/?name=${activeChat.avatar}&background=random&color=fff`} alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="bg-white border border-gray-100 text-gray-700 p-4 rounded-2xl rounded-tl-sm shadow-sm max-w-md text-sm">
                    Yes, continue the same medicines and follow the diet I recommended.
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">10:05 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0 mt-1">
                  <img src="https://ui-avatars.com/api/?name=Shalini+Verma&background=0D8ABC&color=fff" alt="You" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm max-w-md text-sm">
                    Okay doctor, thank you so much.
                  </div>
                  <p className="text-xs text-gray-400 mt-2 mr-1">10:06 AM</p>
                </div>
              </div>

            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="flex items-center gap-4 bg-slate-50 border border-gray-100 p-2 pl-4 rounded-2xl">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip size={20} />
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                  <Send size={18} className="ml-1" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
