import { ShieldCheck } from "lucide-react";

function Navbar() {
  return (
    <nav className="bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 cursor-pointer">
        <ShieldCheck className="text-blue-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-900">MediVerify</h1>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a href="#" className="text-blue-600 font-semibold">Home</a>
        <a href="#how-it-works" className="hover:text-blue-600 transition">How it Works</a>
        <a href="#" className="hover:text-blue-600 transition">Doctors</a>
        <a href="#" className="hover:text-blue-600 transition">Features</a>
        <a href="#" className="hover:text-blue-600 transition">Testimonials</a>
        <a href="#" className="hover:text-blue-600 transition">FAQ</a>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <button className="px-5 py-2 text-gray-700 font-medium hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600 transition">
          Login
        </button>
        <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </nav>
  );
}

export default Navbar;