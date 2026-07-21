import { Stethoscope } from "lucide-react";

const consultations = [
  {
    id: "INV1024",
    doctor: "Dr. Arjun Mehta",
    specialty: "Cardiology",
    date: "18 May 2024",
    status: "In Review",
    statusColor: "text-amber-500 bg-amber-50",
    initials: "AM"
  },
  {
    id: "INV1023",
    doctor: "Dr. Priya Singh",
    specialty: "Dermatology",
    date: "17 May 2024",
    status: "Pending",
    statusColor: "text-orange-500 bg-orange-50",
    initials: "PS"
  },
  {
    id: "INV1021",
    doctor: "Dr. Rohan Verma",
    specialty: "Neurology",
    date: "12 May 2024",
    status: "Completed",
    statusColor: "text-green-500 bg-green-50",
    initials: "RV",
    completedDate: "Completed on 12 May 2024"
  }
];

export default function RecentConsultations() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Recent Consultations</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {consultations.map((item, index) => (
          <div key={index} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Stethoscope size={24} className="text-blue-500"/>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Consultation-#{item.id}</h3>
                <p className="text-sm text-gray-500">{item.specialty} • {item.doctor}</p>
                {item.completedDate ? (
                  <p className="text-xs text-gray-400 mt-1">{item.completedDate}</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                )}
              </div>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.statusColor}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
