function Testimonials() {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
  
          <div className="text-center">
            <h2 className="text-4xl font-bold">
              What Our Patients Say
            </h2>
  
            <p className="mt-4 text-gray-600">
              Trusted by thousands of patients across India.
            </p>
          </div>
  
          <div className="grid md:grid-cols-3 gap-8 mt-16">
  
            <div className="bg-white p-8 rounded-2xl shadow">
              <p className="text-gray-600">
                "MediVerify helped me get a trusted second opinion quickly."
              </p>
  
              <h4 className="mt-6 font-semibold">
                — Rahul Sharma
              </h4>
            </div>
  
            <div className="bg-white p-8 rounded-2xl shadow">
              <p className="text-gray-600">
                "The AI analysis saved me time before consulting a doctor."
              </p>
  
              <h4 className="mt-6 font-semibold">
                — Priya Verma
              </h4>
            </div>
  
            <div className="bg-white p-8 rounded-2xl shadow">
              <p className="text-gray-600">
                "Simple, secure and easy to use."
              </p>
  
              <h4 className="mt-6 font-semibold">
                — Aman Gupta
              </h4>
            </div>
  
          </div>
  
        </div>
      </section>
    );
  }
  
  export default Testimonials;