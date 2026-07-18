function HowItWorks() {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
  
          <div className="text-center">
            <h2 className="text-4xl font-bold">
              How It Works
            </h2>
  
            <p className="mt-4 text-gray-600">
              Get your medical reports verified in just three simple steps.
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-10 mt-16">
  
            <div className="bg-slate-50 p-8 rounded-2xl shadow text-center">
              <h3 className="text-2xl font-bold text-blue-600">01</h3>
  
              <h4 className="mt-4 text-xl font-semibold">
                Upload Report
              </h4>
  
              <p className="mt-3 text-gray-600">
                Upload your medical report securely.
              </p>
            </div>
  
            <div className="bg-slate-50 p-8 rounded-2xl shadow text-center">
              <h3 className="text-2xl font-bold text-blue-600">02</h3>
  
              <h4 className="mt-4 text-xl font-semibold">
                AI Analysis
              </h4>
  
              <p className="mt-3 text-gray-600">
                AI performs an initial analysis of your report.
              </p>
            </div>
  
            <div className="bg-slate-50 p-8 rounded-2xl shadow text-center">
              <h3 className="text-2xl font-bold text-blue-600">03</h3>
  
              <h4 className="mt-4 text-xl font-semibold">
                Doctor Verification
              </h4>
  
              <p className="mt-3 text-gray-600">
                A verified doctor reviews and confirms the report.
              </p>
            </div>
  
          </div>
  
        </div>
      </section>
    );
  }
  
  export default HowItWorks;