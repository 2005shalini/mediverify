import React from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const handleNavClick = (e, id) => {
    e.preventDefault();
    
    if (location.pathname !== "/") {
      navigate('/', { state: { scrollTo: id || 'home' } });
      return;
    }
    
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 80;
      const y = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleDashboard = () => {
    const role = String(user?.role || "").toLowerCase();
    if (role.includes("admin")) {
      navigate("/admin-dashboard");
    } else if (role.includes("doctor")) {
      navigate("/doctor-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <nav className="bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <ShieldCheck className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-900">MediVerify</h1>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a onClick={(e) => handleNavClick(e, null)} className="hover:text-blue-600 transition font-semibold cursor-pointer">Home</a>
        <a onClick={(e) => handleNavClick(e, 'how-it-works')} className="hover:text-blue-600 transition cursor-pointer">How It Works</a>
        <a onClick={(e) => handleNavClick(e, 'features')} className="hover:text-blue-600 transition cursor-pointer">Features</a>
        <a onClick={(e) => handleNavClick(e, 'doctors')} className="hover:text-blue-600 transition cursor-pointer">Doctors</a>
        <a onClick={(e) => handleNavClick(e, 'testimonials')} className="hover:text-blue-600 transition cursor-pointer">Testimonials</a>
        <a onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-blue-600 transition cursor-pointer">FAQ</a>
      </div>

      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <button
            onClick={handleDashboard}
            type="button"
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer shadow-sm"
          >
            Go to Dashboard
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              type="button"
              className="px-5 py-2 text-gray-700 font-medium hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600 transition cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              type="button"
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;