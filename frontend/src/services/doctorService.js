import apiClient from "../api/axios";
import {
  DOCTOR_PROFILE,
  DOCTOR_DASHBOARD,
  DOCTOR_CASES,
  DOCTOR_HISTORY,
  DOCTOR_DETAILS,
  DOCTOR_LICENSE,
  DOCTOR_AVAILABILITY
} from "../api/endpoints";

/**
 * Get doctor profile details.
 * @param {number|string} userId
 */
export const getProfile = async (userId) => {
  if (!userId) throw new Error("user_id is required");
  const response = await apiClient.get(`${DOCTOR_PROFILE}?user_id=${userId}`);
  return response.data;
};

/**
 * Update doctor profile.
 * @param {Object} data
 */
export const updateProfile = async (data) => {
  if (!data || !data.user_id) throw new Error("user_id is required");
  const response = await apiClient.put(DOCTOR_PROFILE, data);
  return response.data;
};

/**
 * Get doctor dashboard metrics.
 * @param {number|string} userId
 */
export const getDashboard = async (userId) => {
  if (!userId) throw new Error("user_id is required");
  const response = await apiClient.get(`${DOCTOR_DASHBOARD}?user_id=${userId}`);
  return response.data;
};

/**
 * Get assigned doctor cases.
 * @param {number|string} userId
 */
export const getCases = async (userId) => {
  if (!userId) throw new Error("user_id is required");
  const response = await apiClient.get(`${DOCTOR_CASES}?user_id=${userId}`);
  return response.data;
};

/**
 * Get doctor consultation history.
 * @param {number|string} userId
 */
export const getHistory = async (userId) => {
  if (!userId) throw new Error("user_id is required");
  const response = await apiClient.get(`${DOCTOR_HISTORY}?user_id=${userId}`);
  return response.data;
};

/**
 * Get comprehensive doctor details including reviews.
 * @param {number|string} userId
 */
export const getDetails = async (userId) => {
  if (!userId) throw new Error("user_id is required");
  const response = await apiClient.get(`${DOCTOR_DETAILS}?user_id=${userId}`);
  return response.data;
};

/**
 * Get doctor license information.
 * @param {number|string} userId
 */
export const getLicense = async (userId) => {
  if (!userId) throw new Error("user_id is required");
  const response = await apiClient.get(`${DOCTOR_LICENSE}?user_id=${userId}`);
  return response.data;
};

/**
 * Update doctor availability.
 * @param {number|string} userId
 * @param {string} availability ('Available' or 'Unavailable')
 */
export const updateAvailability = async (userId, availability) => {
  if (!userId || !availability) throw new Error("user_id and availability are required");
  const response = await apiClient.put(DOCTOR_AVAILABILITY, { user_id: userId, availability });
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  getDashboard,
  getCases,
  getHistory,
  getDetails,
  getLicense,
  updateAvailability
};
