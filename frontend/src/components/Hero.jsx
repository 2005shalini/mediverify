import { CheckCircle2, PlayCircle, Bot } from "lucide-react";

function Hero() {
  return (
    <section className="min-h-[calc(100vh-76px)] bg-slate-50 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          
          {/* Left Side */}
          <div>
            <h1 className="text-[3.5rem] font-bold leading-tight text-gray-900">
              Verify Your Treatment.<br />
              <span className="text-blue-600">Not Just Your Diagnosis.</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
              Upload your medical reports and get a second opinion from verified specialists.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex items-center gap-5">
              <button className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                Get Started
              </button>
              <a href="#how-it-works" className="flex items-center gap-2 px-6 py-3.5 text-gray-700 font-medium hover:text-blue-600 transition">
                <PlayCircle size={20} />
                How It Works
              </a>
            </div>

            {/* Features Row */}
            <div className="mt-12 flex flex-wrap gap-x-6 gap-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CheckCircle2 size={18} className="text-blue-600" />
                Verified Specialists
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CheckCircle2 size={18} className="text-blue-600" />
                AI Assisted Summary
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CheckCircle2 size={18} className="text-blue-600" />
                Secure & Private
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <CheckCircle2 size={18} className="text-blue-600" />
                Fast & Reliable
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex justify-center mt-10 md:mt-0">
            {/* Background Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-blue-100 rounded-full -z-10"></div>
            
            {/* Main Image */}
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
              alt="Doctor"
              className="w-[420px] h-[550px] object-cover rounded-[40px] shadow-2xl"
            />
            
            {/* Floating Card: AI Analysis */}
            <div className="absolute top-10 -right-4 md:-right-8 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">AI Analysis</p>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ready
                </p>
              </div>
            </div>

            {/* Floating Card: Trusted By */}
            <div className="absolute bottom-10 -left-4 md:-left-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-2">Trusted by 10K+ Patients</p>
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=1" alt="user" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=2" alt="user" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=3" alt="user" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?img=4" alt="user" className="w-8 h-8 rounded-full border-2 border-white" />
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600 z-10">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;