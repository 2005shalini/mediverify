import { CalendarDays } from "lucide-react";

export default function WelcomeCard() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Welcome back, Shalini 👋
          </h2>

          <p className="mt-2 text-blue-100">
            Your health dashboard is up to date. Check your latest reports and
            consultations.
          </p>

          <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition">
            Upload New Report
          </button>
        </div>

        <div className="hidden md:flex items-center justify-center w-28 h-28 rounded-full bg-white/20">
          <CalendarDays size={50} />
        </div>
      </div>
    </div>
  );
}
