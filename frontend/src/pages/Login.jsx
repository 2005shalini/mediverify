import LoginForm from "../components/LoginForm";
import Logo from "../components/Logo";
function Login() {
  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col">
      <div className="p-6 absolute top-0 left-0 w-full">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
