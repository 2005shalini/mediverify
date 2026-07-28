import apiClient from "../api/axios";
import {
  AI_ANALYZE,
  AI_REPORT,
  AI_HISTORY,
  INSIGHT_GENERATE,
  INSIGHT_GET,
  INSIGHT_HISTORY
} from "../api/endpoints";

/**
 * Trigger AI analysis for a report.
 * @param {number|string} reportId 
 * @param {number|string} patientId 
 */
export const analyzeReport = async (reportId, patientId) => {
  const response = await apiClient.post(AI_ANALYZE, {
    report_id: reportId,
    patient_id: patientId
  });
  return response.data;
};

/**
 * Get AI analysis results for a report.
 * @param {number|string} reportId 
 */
export const getAnalysis = async (reportId) => {
  if (!reportId) throw new Error("Report ID is required");
  const response = await apiClient.get(`${AI_REPORT}?id=${reportId}`);
  return response.data;
};

/**
 * Trigger Medical Insights generation for an analyzed report.
 * @param {number|string} reportId 
 */
export const generateInsights = async (reportId) => {
  const response = await apiClient.post(INSIGHT_GENERATE, {
    report_id: reportId
  });
  return response.data;
};

/**
 * Get Medical Insights for a report.
 * @param {number|string} reportId 
 */
export const getMedicalInsights = async (reportId) => {
  if (!reportId) throw new Error("Report ID is required");
  const response = await apiClient.get(`${INSIGHT_GET}?id=${reportId}`);
  return response.data;
};

/**
 * Get AI analysis history for a patient.
 * @param {number|string} patientId 
 */
export const getAnalysisHistory = async (patientId) => {
  const response = await apiClient.get(`${AI_HISTORY}?patient_id=${patientId}`);
  return response.data;
};

/**
 * Get Medical Insights history for a patient.
 * @param {number|string} patientId 
 */
export const getInsightHistory = async (patientId) => {
  const response = await apiClient.get(`${INSIGHT_HISTORY}?patient_id=${patientId}`);
  return response.data;
};

export default {
  analyzeReport,
  getAnalysis,
  generateInsights,
  getMedicalInsights,
  getAnalysisHistory,
  getInsightHistory
};
