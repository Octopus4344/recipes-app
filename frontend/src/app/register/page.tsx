import { AuthForm } from "@/components/auth-form";
import { RegistrationForm } from "@/components/ui/sign-up";


export default function RegisterPage() {
  return <RegistrationForm endpoint={"user/register"} alt={"Sign in"} current={"Sign up"} path={"login"} />;
}