import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const getStatusColor = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("review")) return "text-amber-500 bg-amber-50";
  if (s.includes("pend")) return "text-orange-500 bg-orange-50";
  if (s.includes("complet")) return "text-green-500 bg-green-50";
  if (s.includes("accept")) return "text-blue-500 bg-blue-50";
  if (s.includes("reject") || s.includes("cancel")) return "text-red-500 bg-red-50";
  return "text-gray-500 bg-gray-50";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
};

export default function RecentConsultations({ consultations = [] }) {
  // Use provided data or fallback to empty state
  const data = Array.isArray(consultations) ? consultations : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Recent Consultations</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {data.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No recent consultations found.
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Stethoscope size={24} className="text-blue-500"/>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    <Link to={`/consultation-details?id=${item.id || item.consultation_id}`} className="hover:text-blue-600 transition-colors">
                      Consultation-#{item.id || item.consultation_id || "NEW"}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500">{item.doctor_specialization || item.specialty || "General"} • {item.doctor_name || item.doctor || "Doctor"}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {String(item.status).toLowerCase().includes("complet") 
                      ? `Completed on ${formatDate(item.updated_at || item.created_at || item.date)}`
                      : formatDate(item.created_at || item.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                  {item.status || "Pending"}
                </span>
                <Link to={`/consultation-details?id=${item.id || item.consultation_id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
