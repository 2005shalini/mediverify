import apiClient from "../api/axios";
import {
  ADMIN_LOGIN,
  ADMIN_DASHBOARD,
  ADMIN_DASHBOARD_REVENUE,
  ADMIN_DASHBOARD_CONSULTATIONS,
  ADMIN_DASHBOARD_REPORTS,
  ADMIN_USERS,
  ADMIN_USERS_SEARCH,
  ADMIN_DOCTORS_PENDING,
  ADMIN_DOCTORS_VERIFY,
  ADMIN_DOCTORS_REJECT,
  ADMIN_DASHBOARD_SUMMARY
} from "../api/endpoints";

export const login = async (email, password) => {
  const response = await apiClient.post(ADMIN_LOGIN, { email, password });
  return response.data;
};

export const getDashboard = async () => {
  const response = await apiClient.get(ADMIN_DASHBOARD);
  return response.data;
};

export const getUsers = async (search = "") => {
  const url = search ? `${ADMIN_USERS_SEARCH}?q=${encodeURIComponent(search)}` : ADMIN_USERS;
  const response = await apiClient.get(url);
  return response.data;
};

export const getPendingDoctors = async () => {
  const response = await apiClient.get(ADMIN_DOCTORS_PENDING);
  return response.data;
};

export const verifyDoctor = async (doctorId) => {
  const response = await apiClient.post(ADMIN_DOCTORS_VERIFY, { doctor_id: doctorId });
  return response.data;
};

export const rejectDoctor = async (doctorId) => {
  const response = await apiClient.post(ADMIN_DOCTORS_REJECT, { doctor_id: doctorId });
  return response.data;
};

export const getPayments = async () => {
  const response = await apiClient.get(ADMIN_DASHBOARD_REVENUE);
  return response.data;
};

export const getConsultations = async () => {
  const response = await apiClient.get(ADMIN_DASHBOARD_CONSULTATIONS);
  return response.data;
};

export const getReports = async () => {
  const response = await apiClient.get(ADMIN_DASHBOARD_REPORTS);
  return response.data;
};

export const getSystemSummary = async () => {
  const response = await apiClient.get(ADMIN_DASHBOARD_SUMMARY);
  return response.data;
};

export default {
  login,
  getDashboard,
  getUsers,
  getPendingDoctors,
  verifyDoctor,
  rejectDoctor,
  getPayments,
  getConsultations,
  getReports,
  getSystemSummary
};
