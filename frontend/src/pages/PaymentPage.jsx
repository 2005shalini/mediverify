import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import paymentService from "../services/paymentService";
import consultationService from "../services/consultationService";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const consultationId = new URLSearchParams(location.search).get("consultation_id");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(399); // Default to Priority
  const [consultationDetails, setConsultationDetails] = useState(null);

  useEffect(() => {
    if (!consultationId) return;
    
    // Fetch consultation details to show what they are paying for
    const fetchConsultation = async () => {
      try {
        const data = await consultationService.getConsultation(consultationId);
        setConsultationDetails(data);
      } catch (err) {
        console.error("Failed to fetch consultation details", err);
      }
    };
    fetchConsultation();
  }, [consultationId]);

  const handlePayment = async () => {
    if (!consultationId) {
      setError("No consultation selected for payment.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // 1. Create order on backend
      const orderData = await paymentService.createOrder({
        patient_id: user.id,
        consultation_id: consultationId,
        amount: selectedPlan,
        currency: "INR"
      });

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MediVerify",
        description: `Consultation Fee for ID: ${consultationId}`,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            setLoading(true);
            // 3. Verify Payment
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            // 4. Navigate to history on success
            navigate("/payment-history");
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.message || verifyErr.message || "Payment verification failed.");
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#2563EB"
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function (response) {
        setError(response.error.description || "Payment failed or was cancelled.");
      });

      paymentObject.open();

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8 flex justify-center">
        <div className="w-full max-w-3xl">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Choose a plan that fits your needs
              </h1>
              {consultationDetails && (
                <p className="text-gray-500 mt-2 font-medium">
                  Paying for Consultation #{consultationDetails.id} • Dr. {consultationDetails.doctor_name || "Assigned Doctor"}
                </p>
              )}
            </div>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          <div className="space-y-4 mb-10">
            {/* Basic Review Plan */}
            <label className="cursor-pointer block">
              <input type="radio" name="plan" value={199} className="hidden" onChange={() => setSelectedPlan(199)} />
              <div className={`rounded-2xl p-6 border transition-colors flex items-center justify-between shadow-sm ${selectedPlan === 199 ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 199 ? "border-blue-600" : "border-gray-300"}`}>
                    {selectedPlan === 199 && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${selectedPlan === 199 ? "text-blue-900" : "text-gray-900"}`}>Basic Review</h3>
                    <p className={`text-sm mt-1 ${selectedPlan === 199 ? "text-blue-700/80" : "text-gray-500"}`}>Get written opinion within 24 hours</p>
                  </div>
                </div>
                <div className={`text-xl font-bold ${selectedPlan === 199 ? "text-blue-900" : "text-gray-900"}`}>₹199</div>
              </div>
            </label>

            {/* Priority Review Plan */}
            <label className="cursor-pointer block relative">
              <input type="radio" name="plan" value={399} className="hidden" onChange={() => setSelectedPlan(399)} />
              <div className={`rounded-2xl p-6 border transition-colors flex items-center justify-between shadow-sm ${selectedPlan === 399 ? "bg-blue-50 border-blue-500 border-2" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 399 ? "border-blue-600" : "border-gray-300"}`}>
                    {selectedPlan === 399 && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${selectedPlan === 399 ? "text-blue-900" : "text-gray-900"}`}>Priority Review</h3>
                    <p className={`text-sm mt-1 ${selectedPlan === 399 ? "text-blue-700/80" : "text-gray-500"}`}>Get written opinion within 6 hours</p>
                  </div>
                </div>
                <div className={`text-xl font-bold ${selectedPlan === 399 ? "text-blue-900" : "text-gray-900"}`}>₹399</div>
                
                <div className={`absolute top-1/2 -translate-y-1/2 right-32 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${selectedPlan === 399 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                  <CheckCircle2 size={14} />
                  Recommended
                </div>
              </div>
            </label>

            {/* Video Consultation Plan */}
            <label className="cursor-pointer block">
              <input type="radio" name="plan" value={699} className="hidden" onChange={() => setSelectedPlan(699)} />
              <div className={`rounded-2xl p-6 border transition-colors flex items-center justify-between shadow-sm ${selectedPlan === 699 ? "bg-blue-50 border-blue-500" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === 699 ? "border-blue-600" : "border-gray-300"}`}>
                    {selectedPlan === 699 && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${selectedPlan === 699 ? "text-blue-900" : "text-gray-900"}`}>Video Consultation</h3>
                    <p className={`text-sm mt-1 ${selectedPlan === 699 ? "text-blue-700/80" : "text-gray-500"}`}>Includes written opinion + video call</p>
                  </div>
                </div>
                <div className={`text-xl font-bold ${selectedPlan === 699 ? "text-blue-900" : "text-gray-900"}`}>₹699</div>
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

            <button 
              onClick={handlePayment}
              disabled={loading || !consultationId}
              className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md shadow-blue-200 transition-colors text-lg disabled:bg-blue-400"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : `Pay ₹${selectedPlan} Securely`}
            </button>
            {!consultationId && <p className="text-red-500 text-sm text-center mt-3">Please access payment via a specific consultation.</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
