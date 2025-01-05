import { RegistrationForm } from "@/components/sign-up";


export default function RegisterPage() {
  return <RegistrationForm endpoint={"user/register"} alt={"Sign in"} current={"Sign up"} path={"login"} />;
}