import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import StatsCards from "../components/dashboard/StatsCards";
import RecentConsultations from "../components/dashboard/RecentConsultations";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      <Sidebar />

      <div className="ml-64 p-8">
        <TopNavbar />

        <div className="mt-2">
          <StatsCards />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentConsultations />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}