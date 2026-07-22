import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import CreateConsultation from "../pages/CreateConsultation";
import AIAnalysis from "../pages/AIAnalysis";
import DoctorSelection from "../pages/DoctorSelection";
import PaymentPage from "../pages/PaymentPage";
import ConsultationDetails from "../pages/ConsultationDetails";
import ChatPage from "../pages/ChatPage";
import ProfilePage from "../pages/ProfilePage";
import DoctorDashboard from "../pages/DoctorDashboard";
import DoctorReviewPage from "../pages/DoctorReviewPage";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-consultation" element={<CreateConsultation />} />
        <Route path="/ai-analysis" element={<AIAnalysis />} />
        <Route path="/doctor-selection" element={<DoctorSelection />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/consultation-details" element={<ConsultationDetails />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor-review" element={<DoctorReviewPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}