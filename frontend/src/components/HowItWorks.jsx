import {
    Upload,
    Bot,
    Stethoscope,
    BadgeCheck,
    ChevronRight,
  } from "lucide-react";
  
  function HowItWorks() {
    const steps = [
      {
        icon: <Upload size={40} className="text-blue-600" />,
        title: "Upload Reports",
        description:
          "Upload prescriptions, lab reports and medical scans securely.",
      },
      {
        icon: <Bot size={40} className="text-blue-600" />,
        title: "AI Analysis",
        description:
          "Our AI analyzes your reports and prepares an easy-to-understand summary.",
      },
      {
        icon: <Stethoscope size={40} className="text-blue-600" />,
        title: "Doctor Review",
        description:
          "Verified doctors review your reports for an accurate second opinion.",
      },
      {
        icon: <BadgeCheck size={40} className="text-blue-600" />,
        title: "Get Recommendation",
        description:
          "Receive personalized treatment recommendations from experts.",
      },
    ];
  
    return (
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
  
          {/* Heading */}
  
          <div className="text-center">
            <h2 className="text-4xl font-bold">
              How It Works
            </h2>
  
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Get your treatment verified in four simple steps with the help of
              AI and experienced medical professionals.
            </p>
          </div>
  
          {/* Steps */}
  
          <div className="grid md:grid-cols-4 gap-8 mt-16">
  
            {steps.map((step, index) => (
              <div key={index} className="relative">
  
                {/* Arrow */}
  
                {index !== steps.length - 1 && (
                  <div className="hidden md:flex absolute top-12 -right-6 z-10">
                    <ChevronRight className="text-gray-300" size={28} />
                  </div>
                )}
  
                {/* Card */}
  
                <div className="bg-slate-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition duration-300 h-full">
  
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                    {step.icon}
                  </div>
  
                  <h3 className="mt-6 text-xl font-semibold">
                    {step.title}
                  </h3>
  
                  <p className="mt-4 text-gray-500 text-sm leading-7">
                    {step.description}
                  </p>
  
                </div>
  
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    );
  }
  
  export default HowItWorks;