import apiClient from "../api/axios";
import {
  CONSULTATION_CREATE,
  CONSULTATION_ALL,
  CONSULTATION_DETAILS,
  CONSULTATION_PATIENT_HISTORY,
  CONSULTATION_DOCTOR_HISTORY,
  CONSULTATION_ACCEPT,
  CONSULTATION_REJECT,
  CONSULTATION_COMPLETE,
  CONSULTATION_NOTES,
  CONSULTATION_PRESCRIPTION,
  CONSULTATION_MEETING
} from "../api/endpoints";

/**
 * Create a new consultation.
 * @param {Object} data 
 */
export const createConsultation = async (data) => {
  const response = await apiClient.post(CONSULTATION_CREATE, data);
  return response.data;
};

/**
 * Get all consultations (can be filtered by query params).
 * @param {Object} params 
 */
export const getConsultations = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${CONSULTATION_ALL}?${queryString}` : CONSULTATION_ALL;
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * Get consultation details by ID.
 * @param {number|string} id 
 */
export const getConsultation = async (id) => {
  if (!id) throw new Error("Consultation ID is required");
  const response = await apiClient.get(`${CONSULTATION_DETAILS}?id=${id}`);
  return response.data;
};

/**
 * Update consultation.
 * @param {Object} data 
 */
export const updateConsultation = async (data) => {
  const response = await apiClient.put("/consultation/update", data); // Fallback if endpoint missing
  return response.data;
};

/**
 * Delete consultation.
 * @param {number|string} id 
 */
export const deleteConsultation = async (id) => {
  if (!id) throw new Error("Consultation ID is required");
  const response = await apiClient.delete(`/consultation/delete?id=${id}`);
  return response.data;
};

/**
 * Update status of consultation (accept/reject/complete).
 * @param {number|string} id 
 * @param {string} action ('accept', 'reject', 'complete')
 * @param {Object} extraData 
 */
export const updateStatus = async (id, action, extraData = {}) => {
  let endpoint = "";
  if (action === "accept") endpoint = CONSULTATION_ACCEPT;
  else if (action === "reject") endpoint = CONSULTATION_REJECT;
  else if (action === "complete") endpoint = CONSULTATION_COMPLETE;
  else throw new Error("Invalid status action");

  const response = await apiClient.put(endpoint, { id, ...extraData });
  return response.data;
};

/**
 * Add doctor notes.
 * @param {number|string} id 
 * @param {string} notes 
 */
export const addDoctorNotes = async (id, notes) => {
  const response = await apiClient.put(CONSULTATION_NOTES, { id, doctor_notes: notes });
  return response.data;
};

/**
 * Add prescription.
 * @param {number|string} id 
 * @param {string} prescription 
 */
export const addPrescription = async (id, prescription) => {
  const response = await apiClient.put(CONSULTATION_PRESCRIPTION, { id, prescription });
  return response.data;
};

/**
 * Add meeting link.
 * @param {number|string} id 
 * @param {string} link 
 */
export const addMeetingLink = async (id, link) => {
  const response = await apiClient.put(CONSULTATION_MEETING, { id, meeting_link: link });
  return response.data;
};

export const getPatientHistory = async (patientId) => {
  const response = await apiClient.get(`${CONSULTATION_PATIENT_HISTORY}?patient_id=${patientId}`);
  return response.data;
};

export const getDoctorHistory = async (doctorId) => {
  const response = await apiClient.get(`${CONSULTATION_DOCTOR_HISTORY}?doctor_id=${doctorId}`);
  return response.data;
};

export default {
  createConsultation,
  getConsultations,
  getConsultation,
  updateConsultation,
  deleteConsultation,
  updateStatus,
  addDoctorNotes,
  addPrescription,
  addMeetingLink,
  getPatientHistory,
  getDoctorHistory
};
