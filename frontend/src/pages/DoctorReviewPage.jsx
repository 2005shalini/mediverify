import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import { Star, MessageSquare, ThumbsUp, Calendar } from "lucide-react";

export default function DoctorReviewPage() {
  const reviews = [
    {
      id: 1,
      patientName: "Rahul Sharma",
      date: "12 Oct 2026",
      rating: 5,
      comment: "Dr. Smith is an amazing cardiologist. Very patient and explained everything in detail. Highly recommended!",
      likes: 12
    },
    {
      id: 2,
      patientName: "Anita Desai",
      date: "05 Sep 2026",
      rating: 4,
      comment: "Good experience overall. The consultation started a bit late, but the diagnosis was spot on.",
      likes: 4
    },
    {
      id: 3,
      patientName: "Vikram Singh",
      date: "22 Aug 2026",
      rating: 5,
      comment: "Excellent tele-consultation. The platform works perfectly and the doctor was very helpful.",
      likes: 8
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <TopNavbar />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Doctor Profile & Rating Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col items-center text-center">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80"
                alt="Doctor Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#F4F7FE] shadow-sm mb-4"
              />
              <h2 className="text-xl font-bold text-gray-900">Dr. Sarah Smith</h2>
              <p className="text-blue-600 font-medium text-sm mb-2">Cardiologist</p>
              
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 font-bold text-gray-900">4.8</span>
                <span className="text-sm text-gray-500">(124 reviews)</span>
              </div>
              
              <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium text-sm shadow-sm shadow-blue-200">
                Write a Review
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Rating Breakdown</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium text-gray-700">{rating}</span>
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full" 
                        style={{ width: `${rating === 5 ? 75 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Reviews List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-600" />
                  Patient Reviews
                </h3>
                <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                  <option>Most Recent</option>
                  <option>Highest Rated</option>
                  <option>Lowest Rated</option>
                </select>
              </div>

              <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {review.patientName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{review.patientName}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar size={12} />
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      "{review.comment}"
                    </p>
                    
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 transition">
                        <ThumbsUp size={14} />
                        Helpful ({review.likes})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
