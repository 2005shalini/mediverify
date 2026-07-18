import doctor from "../assets/doctor.png";
function Hero() {
  return (
    <section className="min-h-screen bg-slate-50 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Left Side */}
          <div>
          <h1 className="text-6xl font-extrabold leading-tight text-gray-900">
           Verify Your <br />
           Treatment with <span className="text-blue-600">Confidence</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-lg">
              Upload your medical reports and get a verified second opinion
              from experienced doctors.
            </p>

            {/* CTA Buttons */}
            {/* CTA Buttons */}
<div className="mt-10 flex gap-5">
  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
    Get Started
  </button>

  <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition">
    Learn More
  </button>
</div>

            {/* Statistics */}
            <div className="mt-12 flex gap-10">

              <div>
                <h2 className="text-3xl font-bold text-blue-600">5000+</h2>
                <p className="text-gray-500">Verified Doctors</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-blue-600">20K+</h2>
                <p className="text-gray-500">Patients</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-blue-600">98%</h2>
                <p className="text-gray-500">Success Rate</p>
              </div>

            </div>

          </div>
{/* Right Side */}

<div className="flex justify-center">

  <img

    src={doctor}

    alt="Doctor"

    className="w-[450px]"

  />

</div>

        </div>

      </div>
    </section>
  );
}

export default Hero;