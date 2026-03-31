import { Toaster } from "sonner";
import { LoginCard } from "../../components/LoginCard";

const LoginPage = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <LoginCard />
      <Toaster />
    </div>
  );
};

export default LoginPage;
