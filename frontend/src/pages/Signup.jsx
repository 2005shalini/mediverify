import SignupForm from "../components/SignupForm";
import Logo from "../components/Logo";
function Signup() {
  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col">
      <div className="p-6 absolute top-0 left-0 w-full">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <SignupForm />
      </div>
    </div>
  );
}

export default Signup;