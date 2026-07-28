import apiClient from "../api/axios";
import {
  PAYMENT,
  PAYMENT_CREATE_ORDER,
  PAYMENT_VERIFY,
  PAYMENT_HISTORY,
  PAYMENT_INVOICE,
  PAYMENT_REFUND,
  PAYMENT_DASHBOARD
} from "../api/endpoints";

/**
 * Create Razorpay Order
 * @param {Object} payload - { patient_id, consultation_id, amount, currency }
 */
export const createOrder = async (payload) => {
  const response = await apiClient.post(PAYMENT_CREATE_ORDER, payload);
  return response.data;
};

/**
 * Verify Razorpay Payment
 * @param {Object} payload - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (payload) => {
  const response = await apiClient.post(PAYMENT_VERIFY, payload);
  return response.data;
};

/**
 * Get Payment History for a patient
 * @param {number|string} patientId 
 */
export const getHistory = async (patientId) => {
  const response = await apiClient.get(`${PAYMENT_HISTORY}?patient_id=${patientId}`);
  return response.data;
};

/**
 * Get specific payment details
 * @param {number|string} paymentId 
 */
export const getPaymentDetails = async (paymentId) => {
  const response = await apiClient.get(`${PAYMENT}?payment_id=${paymentId}`);
  return response.data;
};

/**
 * Get Payment Invoice
 * @param {number|string} paymentId 
 */
export const getInvoice = async (paymentId) => {
  const response = await apiClient.get(`${PAYMENT_INVOICE}?payment_id=${paymentId}`);
  return response.data;
};

/**
 * Request Refund
 * @param {number|string} paymentId 
 */
export const requestRefund = async (paymentId) => {
  const response = await apiClient.post(PAYMENT_REFUND, { payment_id: paymentId });
  return response.data;
};

/**
 * Get Payment Dashboard Analytics
 */
export const getDashboard = async () => {
  const response = await apiClient.get(PAYMENT_DASHBOARD);
  return response.data;
};

export default {
  createOrder,
  verifyPayment,
  getHistory,
  getPaymentDetails,
  getInvoice,
  requestRefund,
  getDashboard
};
