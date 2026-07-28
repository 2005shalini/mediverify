import apiClient from "../api/axios";
import {
  REPORT_UPLOAD,
  REPORT_ALL,
  REPORT_DELETE,
  REPORT_DOWNLOAD,
  REPORT
} from "../api/endpoints";

/**
 * Upload a new report using multipart/form-data.
 * @param {FormData} formData 
 */
export const uploadReport = async (formData) => {
  const response = await apiClient.post(REPORT_UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

/**
 * Get all reports for a specific patient.
 * @param {number|string} patientId 
 */
export const getReports = async (patientId) => {
  const response = await apiClient.get(`${REPORT_ALL}?patient_id=${patientId}`);
  return response.data;
};

/**
 * Get single report details.
 * @param {number|string} id 
 */
export const getReport = async (id) => {
  if (!id) throw new Error("Report ID is required");
  const response = await apiClient.get(`${REPORT}?id=${id}`);
  return response.data;
};

/**
 * Delete a report.
 * @param {number|string} id 
 */
export const deleteReport = async (id) => {
  if (!id) throw new Error("Report ID is required");
  const response = await apiClient.delete(`${REPORT_DELETE}?id=${id}`);
  return response.data;
};

/**
 * Download a report (Returns Blob for file download).
 * @param {number|string} id 
 */
export const downloadReport = async (id) => {
  if (!id) throw new Error("Report ID is required");
  const response = await apiClient.get(`${REPORT_DOWNLOAD}?id=${id}`, {
    responseType: "blob"
  });
  return response;
};

export default {
  uploadReport,
  getReports,
  getReport,
  deleteReport,
  downloadReport
};
