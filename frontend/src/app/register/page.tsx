import { AuthForm } from "@/components/auth-form";


export default function RegisterPage() {
  return <AuthForm endpoint={"register"} alt={"Sign in"} current={"Sign up"} path={"login"} />;
}