import Sidebar from "../components/dashboard/Sidebar";
import { Star, MapPin, GraduationCap } from "lucide-react";

const doctors = [
  {
    name: "Dr. Arjun Mehta",
    specialty: "Cardiologist",
    degrees: "MBBS, MD, DM (Cardiology)",
    hospital: "AIIMS, New Delhi",
    experience: "15 Years",
    rating: "4.8",
    reviews: "(262)",
    fee: "₹299",
    availability: "Available Now",
    availableNow: true,
  },
  {
    name: "Dr. Priya Singh",
    specialty: "Cardiologist",
    degrees: "MBBS, MD, DM (Cardiology)",
    hospital: "Fortis Hospital, Mumbai",
    experience: "12 Years",
    rating: "4.7",
    reviews: "(215)",
    fee: "₹249",
    availability: "Available Now",
    availableNow: true,
  },
  {
    name: "Dr. Rohan Verma",
    specialty: "Cardiologist",
    degrees: "MBBS, MD, DM (Cardiology)",
    hospital: "Max Hospital, Delhi",
    experience: "10 Years",
    rating: "4.6",
    reviews: "(212)",
    fee: "₹199",
    availability: "Available in 30m",
    availableNow: true, // green dot still shown for "Available in 30m" in design
  }
];

export default function DoctorSelection() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        
        {/* Filters Area */}
        <div className="flex gap-4 mb-8">
          <select className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm">
            <option>Specialization</option>
            <option>Cardiologist</option>
            <option>Dermatologist</option>
            <option>Neurologist</option>
          </select>

          <select className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm">
            <option>Experience</option>
            <option>5+ Years</option>
            <option>10+ Years</option>
            <option>15+ Years</option>
          </select>

          <select className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm">
            <option>Fees</option>
            <option>Under ₹200</option>
            <option>₹200 - ₹500</option>
            <option>Above ₹500</option>
          </select>

          <select className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm">
            <option>Sort by</option>
            <option>Rating: High to Low</option>
            <option>Experience: High to Low</option>
            <option>Fee: Low to High</option>
          </select>
        </div>

        {/* Doctors List */}
        <div className="space-y-4">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
              
              {/* Profile & Info */}
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${doctor.name.replace('Dr. ', '').replace(' ', '+')}&background=random&color=fff`} alt={doctor.name} className="w-full h-full object-cover" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-gray-500 text-sm font-medium">{doctor.specialty}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <GraduationCap size={14} className="text-gray-400" />
                      {doctor.degrees}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {doctor.hospital}
                    </span>
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="text-center px-6 border-l border-gray-100">
                <p className="text-sm font-bold text-gray-900">{doctor.experience}</p>
                <p className="text-xs text-gray-500 mt-1">Experience</p>
              </div>

              {/* Rating */}
              <div className="text-center px-6 border-l border-gray-100">
                <p className="text-sm font-bold text-gray-900 flex items-center justify-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  {doctor.rating}
                </p>
                <p className="text-xs text-gray-500 mt-1">{doctor.reviews}</p>
              </div>

              {/* Fee & Availability */}
              <div className="text-right px-6 border-l border-gray-100 min-w-[140px]">
                <p className="text-lg font-bold text-gray-900">{doctor.fee}</p>
                <p className="text-xs text-gray-500 mt-1">Consultation Fee</p>
                <p className="text-xs text-green-600 font-medium mt-1 flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  {doctor.availability}
                </p>
              </div>

              {/* Action Button */}
              <div className="pl-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-xl shadow-sm transition-colors">
                  Select
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
