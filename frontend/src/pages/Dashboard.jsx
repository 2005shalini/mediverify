import Sidebar from "../components/dashboard/Sidebar";
import TopNavbar from "../components/dashboard/TopNavbar";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCards from "../components/dashboard/StatsCards";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="ml-64 p-8">
        <TopNavbar />

        <div className="mt-6">
          <h1 className="text-3xl font-bold">
            Dashboard
            <TopNavbar />

        <div className="mt-6">
           <WelcomeCard />
        </div>
        <div className="mt-6">
          <StatsCards />
        </div>
          </h1>
        </div>
      </div>
    </div>
  );
}