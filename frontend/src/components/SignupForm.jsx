function SignupForm() {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center">
          Create Account
        </h2>
  
        <p className="text-gray-500 text-center mt-2 mb-8">
          Join MediVerify today
        </p>
  
        <form className="space-y-5">
  
          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>
  
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"
            />
          </div>
  
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>
  
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"
            />
          </div>
  
          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>
  
            <input
              type="password"
              placeholder="Create password"
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"
            />
          </div>
  
          <div>
            <label className="block mb-2 font-medium">
              Confirm Password
            </label>
  
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"
            />
          </div>
  
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Create Account
          </button>
  
        </form>
  
        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer">
            Login
          </span>
        </p>
      </div>
    );
  }
  
  export default SignupForm;