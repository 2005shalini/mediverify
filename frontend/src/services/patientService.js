import apiClient from "../api/axios";
import { PATIENT_PROFILE, DASHBOARD } from "../api/endpoints";

/**
 * Get patient profile details.
 * @param {number|string} userId 
 * @returns {Promise<Object>}
 */
export const getProfile = async (userId) => {
  if (!userId) throw new Error("user_id is required to fetch profile");
  const response = await apiClient.get(`${PATIENT_PROFILE}?user_id=${userId}`);
  return response.data;
};

/**
 * Update patient profile details.
 * @param {Object} data - Contains user_id, age, gender, blood_group, date_of_birth, address, emergency_contact
 * @returns {Promise<Object>}
 */
export const updateProfile = async (data) => {
  if (!data || !data.user_id) throw new Error("user_id is required to update profile");
  const response = await apiClient.put(PATIENT_PROFILE, data);
  return response.data;
};

/**
 * Get patient dashboard summary.
 * @param {number|string} patientId 
 * @returns {Promise<Object>}
 */
export const getDashboard = async (patientId) => {
  if (!patientId) throw new Error("patientId is required to fetch dashboard");
  const response = await apiClient.get(`${DASHBOARD}/${patientId}`);
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  getDashboard,
};
