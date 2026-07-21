import Sidebar from "../components/dashboard/Sidebar";
import { CheckCircle2, CreditCard } from "lucide-react";

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8 flex justify-center">
        <div className="w-full max-w-3xl">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Choose a plan that fits your needs
            </h1>
          </header>

          <div className="space-y-4 mb-10">
            {/* Basic Review Plan */}
            <label className="cursor-pointer block">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Basic Review</h3>
                    <p className="text-gray-500 text-sm mt-1">Get written opinion within 24 hours</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900">₹199</div>
              </div>
            </label>

            {/* Priority Review Plan */}
            <label className="cursor-pointer block relative">
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-500 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">Priority Review</h3>
                    <p className="text-blue-700/80 text-sm mt-1">Get written opinion within 6 hours</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-900">₹399</div>
                
                {/* Recommended Badge */}
                <div className="absolute top-1/2 -translate-y-1/2 right-32 flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                  <CheckCircle2 size={14} />
                  Recommended
                </div>
              </div>
            </label>

            {/* Video Consultation Plan */}
            <label className="cursor-pointer block">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Video Consultation</h3>
                    <p className="text-gray-500 text-sm mt-1">Includes written opinion + video call</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-gray-900">₹699</div>
              </div>
            </label>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              Payment Details
            </h2>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <CreditCard size={20} className="text-gray-400" />
                UPI / Cards / Netbanking
              </div>
              <div className="text-gray-400 font-semibold text-sm">
                Secured by Razorpay
              </div>
            </div>

            {/* Payment Logos Placeholder */}
            <div className="flex gap-4 mb-8 opacity-60">
              <div className="h-8 w-16 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">BHIM</div>
              <div className="h-8 w-16 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">VISA</div>
              <div className="h-8 w-16 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">MC</div>
              <div className="h-8 w-16 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">RuPay</div>
              <div className="h-8 w-16 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">UPI</div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md shadow-blue-200 transition-colors text-lg">
              Pay ₹399 Securely
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
