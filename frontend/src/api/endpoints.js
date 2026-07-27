/**
 * Central registry of all backend API endpoint paths.
 * Do not hardcode API URLs or paths inside React components or services.
 */

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================
export const LOGIN = "/login";
export const SIGNUP = "/signup";
export const USER_PROFILE = "/profile";

// ==========================================
// PATIENT MODULE ENDPOINTS
// ==========================================
export const PATIENT_PROFILE = "/patient/profile";

// ==========================================
// DOCTOR MODULE ENDPOINTS
// ==========================================
export const DOCTOR_PROFILE = "/doctor/profile";
export const DOCTORS_LIST = "/doctors";
export const DOCTORS_SEARCH = "/doctors/search";
export const DOCTORS_TOP = "/doctors/top";
export const DOCTOR_AVAILABILITY = "/doctor/availability";
export const DOCTOR_DASHBOARD = "/doctor/dashboard";
export const DOCTOR_CASES = "/doctor/cases";
export const DOCTOR_HISTORY = "/doctor/history";
export const DOCTOR_DETAILS = "/doctor/details";
export const DOCTOR_LICENSE = "/doctor/license";
export const DOCTOR_REVIEW = "/doctor/review";

// ==========================================
// CONSULTATION MODULE ENDPOINTS
// ==========================================
export const CONSULTATION = "/consultation";
export const CONSULTATION_CREATE = "/consultation/create";
export const CONSULTATION_ALL = "/consultation/all";
export const CONSULTATION_DETAILS = "/consultation/details";
export const CONSULTATION_PATIENT_HISTORY = "/consultation/patient";
export const CONSULTATION_DOCTOR_HISTORY = "/consultation/doctor";
export const CONSULTATION_ACCEPT = "/consultation/accept";
export const CONSULTATION_REJECT = "/consultation/reject";
export const CONSULTATION_COMPLETE = "/consultation/complete";
export const CONSULTATION_NOTES = "/consultation/notes";
export const CONSULTATION_PRESCRIPTION = "/consultation/prescription";
export const CONSULTATION_MEETING = "/consultation/meeting";

// ==========================================
// REPORT MODULE ENDPOINTS
// ==========================================
export const REPORT = "/report";
export const REPORT_UPLOAD = "/report/upload";
export const REPORT_ALL = "/report/all";
export const REPORT_DELETE = "/report/delete";
export const REPORT_DOWNLOAD = "/report/download";

// ==========================================
// AI ANALYSIS MODULE ENDPOINTS
// ==========================================
export const AI_ANALYZE = "/ai/analyze";
export const AI_REPORT = "/ai/report";
export const AI_HISTORY = "/ai/history";

// ==========================================
// MEDICAL INSIGHTS MODULE ENDPOINTS
// ==========================================
export const INSIGHT_GENERATE = "/insight/generate";
export const INSIGHT_GET = "/insight";
export const INSIGHT_HISTORY = "/insight/history";

// ==========================================
// AI DASHBOARD MODULE ENDPOINTS
// ==========================================
export const DASHBOARD = "/dashboard";
export const DASHBOARD_REPORTS = "/dashboard/reports";
export const DASHBOARD_ANALYSIS = "/dashboard/analysis";
export const DASHBOARD_INSIGHTS = "/dashboard/insights";
export const DASHBOARD_CONSULTATIONS = "/dashboard/consultations";
export const DASHBOARD_SUMMARY = "/dashboard/summary";

// ==========================================
// PAYMENT MODULE ENDPOINTS
// ==========================================
export const PAYMENT = "/payment";
export const PAYMENT_CREATE_ORDER = "/payment/create-order";
export const PAYMENT_VERIFY = "/payment/verify";
export const PAYMENT_REFUND = "/payment/refund";
export const PAYMENT_DASHBOARD = "/payment/dashboard";
export const PAYMENT_MONTHLY_REVENUE = "/payment/revenue/monthly";
export const PAYMENT_RECENT = "/payment/recent";
export const PAYMENT_SUMMARY = "/payment/summary";
export const PAYMENT_HISTORY = "/payment/history";
export const PAYMENT_INVOICE = "/payment/invoice";

// ==========================================
// ADMIN MODULE ENDPOINTS
// ==========================================
export const ADMIN = "/admin";
export const ADMIN_LOGIN = "/admin/login";
export const ADMIN_PROFILE = "/admin/profile";
export const ADMIN_LOGOUT = "/admin/logout";
export const ADMIN_USERS = "/admin/users";
export const ADMIN_USERS_SEARCH = "/admin/users/search";
export const ADMIN_USERS_BLOCK = "/admin/users/block";
export const ADMIN_USERS_UNBLOCK = "/admin/users/unblock";
export const ADMIN_DOCTORS_PENDING = "/admin/doctors/pending";
export const ADMIN_DOCTORS_VERIFIED = "/admin/doctors/verified";
export const ADMIN_DOCTORS_REJECTED = "/admin/doctors/rejected";
export const ADMIN_DOCTORS_SEARCH = "/admin/doctors/search";
export const ADMIN_DOCTORS_VERIFY = "/admin/doctors/verify";
export const ADMIN_DOCTORS_REJECT = "/admin/doctors/reject";
export const ADMIN_DASHBOARD = "/admin/dashboard";
export const ADMIN_DASHBOARD_REVENUE = "/admin/dashboard/revenue";
export const ADMIN_DASHBOARD_CONSULTATIONS = "/admin/dashboard/consultations";
export const ADMIN_DASHBOARD_REPORTS = "/admin/dashboard/reports";
export const ADMIN_DASHBOARD_ACTIVITIES = "/admin/dashboard/recent-activities";
export const ADMIN_DASHBOARD_SUMMARY = "/admin/dashboard/system-summary";
