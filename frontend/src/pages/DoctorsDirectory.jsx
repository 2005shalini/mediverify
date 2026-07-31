import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, Clock, RefreshCcw, ChevronLeft, ChevronRight, Heart, Briefcase, User, Calendar, Globe, Building2, ChevronDown, CheckCircle2 } from "lucide-react";
import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import doctorService from "../services/doctorService";

const SPECIALIZATIONS = [
  "All",
  "General Physician",
  "Cardiologist",
  "Neurologist",
  "Neurosurgeon",
  "Gynecologist",
  "Orthopedic",
  "Dermatologist",
  "Pediatrician",
  "Psychiatrist",
  "ENT Specialist",
  "Ophthalmologist",
  "Dentist",
  "More ▼"
];

const DATES = [
  { day: "31 May", weekday: "Fri" },
  { day: "01 Jun", weekday: "Sat" },
  { day: "02 Jun", weekday: "Sun" },
  { day: "03 Jun", weekday: "Mon" },
  { day: "04 Jun", weekday: "Tue" }
];

const TIMES = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "04:00 PM", "04:30 PM", "05:00 PM"];

const FALLBACK_PHOTOS = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594824436998-d50d0354b38d?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=250&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=250&auto=format&fit=crop"
];

const getDoctorPhoto = (doc) => {
  if (doc.profile_photo && doc.profile_photo.startsWith("http")) return doc.profile_photo;
  const id = parseInt(doc.user_id || doc.id || 0, 10) || 0;
  const charCode = doc.full_name ? doc.full_name.charCodeAt(0) : 0;
  return FALLBACK_PHOTOS[(id + charCode) % FALLBACK_PHOTOS.length];
};

export default function DoctorsDirectory() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [sortBy, setSortBy] = useState("Relevance");

  const [selectedDate, setSelectedDate] = useState("31 May");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await doctorService.getAllDoctors();
      const verifiedDoctors = Array.isArray(data) 
        ? data.filter(doc => !doc.verification_status || doc.verification_status === "Approved")
        : [];
      setDoctors(verifiedDoctors);
      if (verifiedDoctors.length > 0) {
        setSelectedDoctor(verifiedDoctors[0]);
      }
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Unable to load doctors at this time.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      doc.full_name?.toLowerCase().includes(searchLower) || 
      doc.specialization?.toLowerCase().includes(searchLower) ||
      doc.hospital?.toLowerCase().includes(searchLower) ||
      doc.qualification?.toLowerCase().includes(searchLower);
    
    const matchesSpecialization = 
      selectedSpecialization === "All" || selectedSpecialization === "More ▼" ||
      doc.specialization?.toLowerCase() === selectedSpecialization.toLowerCase();

    return matchesSearch && matchesSpecialization;
  });

  const handleBookConsultation = (doc) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/create-consultation?doctor=${doc.user_id || doc.id}`)}`);
      return;
    }
    navigate("/create-consultation", { 
      state: { 
        doctorId: doc.user_id || doc.id, 
        doctorName: doc.full_name, 
        doctorSpecialization: doc.specialization, 
        fee: doc.consultation_fee 
      } 
    });
  };

  const handleViewProfile = (doc) => {
    navigate(`/doctors/${doc.user_id || doc.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      {isAuthenticated ? <Sidebar /> : <Navbar />}
      <div className={isAuthenticated ? "ml-64 p-8 flex flex-col min-h-screen" : "p-8 flex flex-col min-h-screen max-w-7xl mx-auto"}>
        {isAuthenticated && <TopNavbar />}

        <div className="mt-4 flex flex-col xl:flex-row gap-8">
          
          {/* LEFT CONTENT AREA */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Find Doctors</h1>
            <p className="text-gray-500 text-sm mt-1 mb-6">
              Choose the right specialist for your healthcare needs.
            </p>

            {/* Search Bar */}
            <div className="relative w-full shadow-sm">
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-14 py-4 bg-white border border-gray-200 rounded-[12px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow text-gray-700 text-sm placeholder-gray-400"
              />
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Specialization Filter Chips */}
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide flex-wrap">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-medium transition-colors border ${
                    selectedSpecialization === spec
                      ? "bg-[#0D6EFD] text-white border-[#0D6EFD] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            <div className="mt-6 mb-5 flex justify-between items-center">
              <span className="text-[14px] text-gray-600 font-medium">Showing {filteredDoctors.length} doctors</span>
              <div className="flex items-center">
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="Relevance">Sort by: Relevance</option>
                    <option value="Highest Rated">Sort by: Highest Rated</option>
                    <option value="Experience">Sort by: Experience</option>
                    <option value="Consultation Fee">Sort by: Consultation Fee</option>
                    <option value="Availability">Sort by: Availability</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl mb-6">
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((skel) => (
                  <div key={skel} className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm animate-pulse">
                    <div className="flex gap-4 mb-4">
                       <div className="w-[72px] h-[72px] bg-gray-200 rounded-full shrink-0"></div>
                       <div className="flex-1 py-2 space-y-2">
                         <div className="h-4 bg-gray-200 rounded w-20"></div>
                         <div className="h-5 bg-gray-200 rounded w-full"></div>
                         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                       </div>
                    </div>
                    <div className="space-y-3 mb-5">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 bg-gray-200 rounded-lg flex-1"></div>
                      <div className="h-9 bg-gray-200 rounded-lg flex-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDoctors.length === 0 && !error ? (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center mt-6">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Search size={40} className="text-blue-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No doctors found.</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-md">
                  We couldn't find any doctors matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedSpecialization("All"); fetchDoctors(); }}
                  className="mt-6 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
                >
                  <RefreshCcw size={18} />
                  Refresh List
                </button>
              </div>
            ) : (
              /* Doctor Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                {filteredDoctors.map((doc) => {
                  const isSelected = selectedDoctor && (selectedDoctor.user_id || selectedDoctor.id) === (doc.user_id || doc.id);
                  return (
                    <div 
                      key={doc.user_id || doc.id} 
                      onClick={() => setSelectedDoctor(doc)}
                      className={`bg-white rounded-[16px] p-5 border transition-all cursor-pointer flex flex-col group relative ${
                        isSelected ? "border-[#0D6EFD] shadow-md ring-1 ring-[#0D6EFD]" : "border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-blue-300 hover:shadow-lg"
                      }`}
                    >
                      <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                        <Heart size={18} />
                      </button>

                      <div className="flex gap-4 items-start mb-4">
                        <div className="w-[72px] h-[72px] rounded-full bg-slate-100 overflow-hidden shrink-0">
                          <img src={getDoctorPhoto(doc)} alt={doc.full_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 pt-0.5 pr-5">
                          <div className="mb-1">
                            {doc.availability === "Available" ? (
                              <span className="text-emerald-600 bg-emerald-50 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full inline-block">Available Today</span>
                            ) : (
                              <span className="text-blue-600 bg-blue-50 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full inline-block">Next Available: Wed</span>
                            )}
                          </div>
                          <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{doc.full_name}</h3>
                          <p className="text-[#0D6EFD] text-[13px] font-medium mt-0.5">{doc.specialization}</p>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-[13px] text-gray-600 mb-5 pl-1">
                        <div className="flex items-center gap-3">
                          <Briefcase size={15} className="text-gray-400 shrink-0" />
                          <span className="truncate">{doc.qualification || "MBBS, MD"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={15} className="text-gray-400 shrink-0" />
                          <span>{doc.experience} Years Experience</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Star size={15} className="text-amber-400 fill-amber-400 shrink-0" />
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900">{doc.rating || "4.8"}</span>
                            <span className="text-gray-500">({doc.reviews_count || Math.floor(Math.random() * 150) + 50} reviews)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-0.5">
                          {/* Empty icon placeholder for alignment */}
                          <div className="w-[15px] shrink-0" />
                          <div className="flex items-center gap-1.5 font-bold text-gray-900">
                            <span className="text-[14px]">₹{doc.consultation_fee}</span>
                            <span className="text-gray-600 font-normal text-xs">Consultation Fee</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex gap-3 w-full">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleViewProfile(doc); }}
                          className="flex-1 py-2 text-[13px] font-semibold text-[#0D6EFD] bg-white border border-[#0D6EFD] rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          View Profile
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleBookConsultation(doc); }}
                          className="flex-1 py-2 text-[13px] font-semibold text-white bg-[#0D6EFD] border border-[#0D6EFD] rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                        >
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Pagination placeholder */}
            {!loading && filteredDoctors.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-2 pb-8">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronLeft size={16}/></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0D6EFD] text-white font-medium text-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm">3</button>
                <span className="text-gray-400 mx-1">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm">5</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronRight size={16}/></button>
              </div>
            )}
          </div>

          {/* RIGHT STICKY PANEL */}
          {selectedDoctor && (
            <div className="hidden xl:block w-[380px] shrink-0">
              <div className="sticky top-8 space-y-6">
                
                {/* Profile Summary Card */}
                <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-[16px] font-bold text-gray-900">Doctor Profile</h2>
                    <button className="text-gray-400 hover:text-red-500 transition-colors"><Heart size={18}/></button>
                  </div>
                  
                  <div className="text-[13px] font-semibold text-[#0D6EFD] cursor-pointer hover:underline mb-5 flex items-center gap-1 w-fit" onClick={() => handleViewProfile(selectedDoctor)}>
                    <ChevronLeft size={14} /> Back to Doctors
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-[100px] h-[120px] rounded-[12px] bg-slate-100 overflow-hidden shrink-0 shadow-sm border border-gray-100">
                      <img src={getDoctorPhoto(selectedDoctor)} alt={selectedDoctor.full_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="pt-0.5">
                      <h3 className="text-[16px] font-bold text-gray-900 flex items-center gap-1.5 leading-tight mb-1">
                        {selectedDoctor.full_name} 
                        {selectedDoctor.verification_status === "Approved" && (
                          <CheckCircle2 size={16} className="text-[#0D6EFD] fill-blue-50" />
                        )}
                      </h3>
                      <p className="text-gray-600 text-[13px] mb-1">{selectedDoctor.specialization}</p>
                      <p className="text-gray-500 text-[12px] mb-1.5">{selectedDoctor.qualification || "MBBS, DM (Neurology)"}</p>
                      <p className="text-gray-500 text-[12px] mb-2">{selectedDoctor.experience} Years Experience</p>
                      <div className="flex items-center gap-1.5 text-[12px] mb-2.5">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold text-gray-800">{selectedDoctor.rating || "4.9"}</span>
                        <span className="text-gray-500">({selectedDoctor.reviews_count || 98} reviews)</span>
                      </div>
                      <div className="font-bold text-gray-900 text-[14px] mb-3">
                        ₹{selectedDoctor.consultation_fee} <span className="text-[12px] font-normal text-gray-500">Consultation Fee</span>
                      </div>
                      <div>
                         {selectedDoctor.availability === "Available" ? (
                           <span className="text-emerald-600 text-[11px] font-bold bg-emerald-50 px-2.5 py-1 rounded-full flex items-center w-fit gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available Tomorrow</span>
                         ) : (
                           <span className="text-gray-500 text-[11px] font-bold bg-gray-100 px-2.5 py-1 rounded-full">Unavailable</span>
                         )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3.5 border-t border-gray-100 pt-5 text-[13px]">
                    <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                      <div className="text-gray-500 flex items-center gap-2"><Building2 size={15}/> Hospital</div>
                      <div className="font-semibold text-gray-900">{selectedDoctor.hospital || "AIIMS, New Delhi"}</div>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                      <div className="text-gray-500 flex items-center gap-2"><Globe size={15}/> Languages</div>
                      <div className="font-semibold text-gray-900">{selectedDoctor.languages || "English, Hindi"}</div>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                      <div className="text-gray-500 flex items-center gap-2"><Calendar size={15}/> Experience</div>
                      <div className="font-semibold text-gray-900">{selectedDoctor.experience} Years</div>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                      <div className="text-gray-500 flex items-center gap-2"><Clock size={15}/> Availability</div>
                      <div className="font-semibold text-gray-900">Mon - Sat (10:00 AM - 4:00 PM)</div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <h4 className="font-bold text-gray-900 text-[14px] mb-2">About Doctor</h4>
                    <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-4">
                      {selectedDoctor.bio || `${selectedDoctor.full_name} is a skilled ${selectedDoctor.specialization} with ${selectedDoctor.experience}+ years of experience in treating brain, spine and nerve-related disorders. She specializes in headache, epilepsy, stroke, and neurodegenerative diseases.`}
                    </p>
                    <button onClick={() => handleViewProfile(selectedDoctor)} className="text-[#0D6EFD] text-[13px] font-semibold mt-1.5 hover:underline">View More</button>
                  </div>
                </div>

                {/* Booking Panel */}
                <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <h3 className="text-[16px] font-bold text-gray-900 mb-5">Book Consultation</h3>
                  
                  <div className="flex justify-between items-start text-[13px] mb-2">
                    <span className="text-gray-500">Doctor</span>
                    <span className="font-semibold text-gray-900 text-right">{selectedDoctor.full_name} <span className="text-gray-500 font-normal">({selectedDoctor.specialization})</span></span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] pb-5 mb-5 border-b border-gray-100">
                    <span className="text-gray-500">Consultation Fee</span>
                    <span className="font-bold text-gray-900 text-[15px]">₹{selectedDoctor.consultation_fee}</span>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[14px] font-medium text-gray-900">Select Date</h4>
                      <div className="flex gap-2">
                        <button className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-50 transition-colors"><ChevronLeft size={16}/></button>
                        <button className="w-7 h-7 rounded-full border border-gray-200 text-[#0D6EFD] flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"><ChevronRight size={16}/></button>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-between">
                      {DATES.map((d, i) => (
                        <button 
                          key={i} 
                          onClick={() => setSelectedDate(d.day)}
                          className={`flex-1 py-2.5 px-1 rounded-xl border flex flex-col items-center justify-center transition-colors ${selectedDate === d.day ? 'bg-[#0D6EFD] border-[#0D6EFD] text-white shadow-sm shadow-blue-100' : 'bg-white border-gray-200 text-gray-800 hover:border-blue-300 hover:shadow-sm'}`}
                        >
                          <span className={`text-[12px] font-bold mb-1 ${selectedDate === d.day ? 'text-white' : 'text-gray-900'}`}>{d.day.split(' ')[0]} {d.day.split(' ')[1]}</span>
                          <span className={`text-[11px] font-medium ${selectedDate === d.day ? 'text-blue-100' : 'text-gray-500'}`}>{d.weekday}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-[14px] font-medium text-gray-900 mb-4">Select Time</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {TIMES.map((time) => (
                        <button 
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2.5 text-[13px] font-semibold rounded-xl transition-all ${selectedTime === time ? 'bg-[#0D6EFD] text-white shadow-md shadow-blue-100 border border-[#0D6EFD]' : 'bg-white border border-gray-200 text-gray-700 hover:bg-slate-50 hover:border-gray-300'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleBookConsultation(selectedDoctor)}
                    className="w-full py-3.5 bg-[#0D6EFD] text-white rounded-xl font-bold text-[14px] hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200/50"
                  >
                    Continue to Booking
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
