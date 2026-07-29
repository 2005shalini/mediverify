import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import CreateConsultation from "../pages/CreateConsultation";
import AIAnalysis from "../pages/AIAnalysis";
import DoctorSelection from "../pages/DoctorSelection";
import PaymentPage from "../pages/PaymentPage";
import PaymentHistory from "../pages/PaymentHistory";
import ConsultationDetails from "../pages/ConsultationDetails";
import ChatPage from "../pages/ChatPage";
import ProfilePage from "../pages/ProfilePage";
import DoctorDashboard from "../pages/DoctorDashboard";
import DoctorProfile from "../pages/DoctorProfile";
import DoctorReviewPage from "../pages/DoctorReviewPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import DoctorVerification from "../pages/DoctorVerification";
import MedicalRecords from "../pages/MedicalRecords";
import UploadReport from "../pages/UploadReport";
import MedicalInsights from "../pages/MedicalInsights";
import AnalysisHistory from "../pages/AnalysisHistory";
import DoctorsDirectory from "../pages/DoctorsDirectory";
import DoctorProfileView from "../pages/DoctorProfileView";
import MyConsultations from "../pages/MyConsultations";
import Notifications from "../pages/Notifications";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<DoctorsDirectory />} />
          <Route path="/doctors/:doctorId" element={<DoctorProfileView />} />
          <Route path="/my-consultations" element={<MyConsultations />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/create-consultation" element={<CreateConsultation />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/medical-insights" element={<MedicalInsights />} />
          <Route path="/analysis-history" element={<AnalysisHistory />} />
          <Route path="/doctor-selection" element={<DoctorSelection />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/consultation-details" element={<ConsultationDetails />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
          <Route path="/doctor-review" element={<DoctorReviewPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/patients" element={<AdminUsers />} />
          
          <Route path="/doctor-verification" element={<DoctorVerification />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/upload-report" element={<UploadReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}