function LoginForm() {

  return (

    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

      <h2 className="text-3xl font-bold text-center">

        Login

      </h2>

      <p className="text-gray-500 text-center mt-2 mb-8">

        Welcome back to MediVerify

      </p>

      <form className="space-y-5">

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

            placeholder="Enter your password"

            className="w-full border rounded-lg p-3 outline-none focus:border-blue-600"

          />

        </div>

        <button

          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"

        >

          Login

        </button>

      </form>

      <p className="text-center mt-6 text-gray-500">

        Don't have an account?{" "}

        <span className="text-blue-600 cursor-pointer">

          Sign Up

        </span>

      </p>

    </div>

  );

}

export default LoginForm;