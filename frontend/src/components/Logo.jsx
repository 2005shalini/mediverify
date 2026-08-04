import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Logo({ className = "", hideText = false }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      const role = String(user?.role || "").toLowerCase();
      if (role.includes("admin")) {
        navigate("/admin-dashboard");
      } else if (role.includes("doctor")) {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div 
      className={`flex items-center gap-2 cursor-pointer ${className}`} 
      onClick={handleLogoClick}
    >
      <ShieldCheck className="text-blue-600 flex-shrink-0" size={28} />
      {!hideText && (
        <span className="text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
          MediVerify
        </span>
      )}
    </div>
  );
}

export default Logo;
