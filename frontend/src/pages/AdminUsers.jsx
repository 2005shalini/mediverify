import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/dashboard/AdminSidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { Users, Search, Filter } from "lucide-react";
import adminService from "../services/adminService";
import { useAuth } from "../hooks/useAuth";

export default function AdminUsers() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async (searchQuery = "") => {
    try {
      setLoading(true);
      const data = await adminService.getUsers(searchQuery);
      setUsersList(data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <AdminSidebar />
      <div className="ml-64 p-8 flex flex-col min-h-screen">
        <TopNavbar />
        
        <div className="mt-8 flex-1">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-500 text-sm mt-1">View and manage all registered users.</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search name or email..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors w-64 shadow-sm"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Search
              </button>
            </form>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users size={20} className="text-blue-600" /> All Users
              </h2>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium">Loading Users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">User Details</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Registration Date</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No users found.</td>
                      </tr>
                    ) : (
                      usersList.map((usr) => (
                        <tr key={usr.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-900">{usr.full_name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{usr.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full capitalize">
                              {usr.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {usr.is_active ? (
                              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">Active</span>
                            ) : (
                              <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200">Blocked</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(usr.created_at)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
