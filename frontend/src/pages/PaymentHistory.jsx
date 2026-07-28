import React, { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../hooks/useAuth";
import paymentService from "../services/paymentService";
import { CreditCard, Download, FileText, ArrowRightLeft, CheckCircle2, Clock, XCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await paymentService.getHistory(user.id);
      setHistory(data || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.friendlyMessage || "Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user?.id]);

  const handleDownloadInvoice = async (paymentId) => {
    try {
      const invoiceData = await paymentService.getInvoice(paymentId);
      
      // Basic mock PDF generation approach for demo purposes, since endpoint returns JSON data instead of raw PDF blob in this setup.
      // If it returned a blob, we'd do window.URL.createObjectURL(new Blob([response.data]))
      // For JSON data, we create a simple text receipt
      
      const receiptText = `
MEDIVERIFY INVOICE
==================
Invoice ID: ${invoiceData.invoice_id}
Date: ${invoiceData.date}

Patient: ${invoiceData.patient_name}
Doctor: ${invoiceData.doctor_name}
Consultation ID: ${invoiceData.consultation_id}

Amount Paid: ${invoiceData.currency} ${invoiceData.amount}
Payment Status: ${invoiceData.payment_status}
Transaction ID: ${invoiceData.razorpay_payment_id || 'N/A'}
==================
Thank you for using MediVerify!
      `;

      const blob = new Blob([receiptText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${invoiceData.invoice_id}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to download invoice.");
    }
  };

  const handleRefund = async (paymentId) => {
    if (!window.confirm("Are you sure you want to request a refund? This is subject to policy approval.")) return;
    try {
      setLoading(true);
      await paymentService.requestRefund(paymentId);
      await fetchHistory(); // Refresh
      alert("Refund requested successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process refund.");
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("success")) return <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200"><CheckCircle2 size={12}/> Success</span>;
    if (s.includes("fail")) return <span className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200"><XCircle size={12}/> Failed</span>;
    if (s.includes("refund")) return <span className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200"><ArrowRightLeft size={12}/> Refunded</span>;
    return <span className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-full border border-orange-200"><Clock size={12}/> Pending</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  // Calculate Dashboard Metrics
  const totalPayments = history.length;
  const successful = history.filter(p => String(p.payment_status).toLowerCase() === "success").length;
  const refunded = history.filter(p => String(p.payment_status).toLowerCase() === "refunded").length;
  const totalAmount = history.filter(p => String(p.payment_status).toLowerCase() === "success").reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="text-blue-600" /> Payments & Invoices
          </h1>
          <p className="text-gray-500 mt-1">Manage your transactions, download invoices, and view refund statuses.</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {/* Payment Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Spent</p>
              <h3 className="text-xl font-bold text-gray-900">₹{totalAmount}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Successful</p>
              <h3 className="text-xl font-bold text-gray-900">{successful}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <ArrowRightLeft size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Refunded</p>
              <h3 className="text-xl font-bold text-gray-900">{refunded}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">Total Orders</p>
              <h3 className="text-xl font-bold text-gray-900">{totalPayments}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading History...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Consultation</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">{item.razorpay_order_id || `ORD-${item.id}`}</p>
                          <p className="text-xs text-gray-400 font-mono mt-1">{item.razorpay_payment_id || "Unpaid"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/consultation-details?id=${item.consultation_id}`} className="text-sm font-semibold text-blue-600 hover:underline">
                            #{item.consultation_id}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(item.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900">
                            {item.currency} {item.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(item.payment_status)}
                          {String(item.payment_status).toLowerCase() === "refunded" && item.refund_date && (
                            <p className="text-[10px] text-gray-400 mt-1">On {formatDate(item.refund_date)}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {String(item.payment_status).toLowerCase() === "success" && (
                              <>
                                <button 
                                  onClick={() => handleDownloadInvoice(item.id)}
                                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                  title="Download Invoice"
                                >
                                  <Download size={14} /> Invoice
                                </button>
                                <button 
                                  onClick={() => handleRefund(item.id)}
                                  className="px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded-lg text-xs font-bold transition flex items-center gap-1"
                                  title="Request Refund"
                                >
                                  <ArrowRightLeft size={14} /> Refund
                                </button>
                              </>
                            )}
                          </div>
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
  );
}
