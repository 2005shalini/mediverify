import {
    FileText,
    Stethoscope,
    Activity,
    ShieldCheck,
  } from "lucide-react";
  
  const stats = [
    {
      title: "Reports",
      value: "12",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Consultations",
      value: "5",
      icon: Stethoscope,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Health Score",
      value: "92%",
      icon: Activity,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Verified",
      value: "100%",
      icon: ShieldCheck,
      color: "bg-orange-100 text-orange-600",
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
              className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-gray-500">{item.title}</p>
  
                <h2 className="text-3xl font-bold mt-2">
                  {item.value}
                </h2>
              </div>
  
              <div className={`p-4 rounded-xl ${item.color}`}>
                <Icon size={28} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }