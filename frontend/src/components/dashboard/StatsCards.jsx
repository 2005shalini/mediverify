import { Activity, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const stats = [
  {
    title: "Active Consultations",
    value: "3",
    icon: Activity,
    color: "text-blue-600",
    bg: "bg-blue-50",
    linkText: "View all"
  },
  {
    title: "Pending Reviews",
    value: "2",
    icon: Clock,
    color: "text-orange-500",
    bg: "bg-orange-50",
    linkText: "View all"
  },
  {
    title: "Completed",
    value: "5",
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-50",
    linkText: "View all"
  },
  {
    title: "Emergency Alerts",
    value: "0",
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-50",
    linkText: "View all"
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-500 font-medium text-sm w-1/2">{item.title}</h3>
              <div className={`p-0 ${item.color}`}>
                <h2 className={`text-4xl font-bold ${item.color}`}>
                  {item.value}
                </h2>
              </div>
            </div>
            
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
               <a href="#" className="text-sm text-blue-600 font-semibold hover:underline">
                 {item.linkText}
               </a>
            </div>
            
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${item.bg} opacity-50 -z-0`}></div>
            <div className={`absolute right-4 bottom-4 z-10 ${item.color} opacity-20`}>
              <Icon size={48} strokeWidth={1.5} />
            </div>
          </div>
        );
      })}
    </div>
  );
}