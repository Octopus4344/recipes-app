import { AuthForm } from "@/components/auth-form";


export default function LoginPage() {
  return <AuthForm endpoint={"user/login"} alt={"Sign up"} current={"Sign in"} path={"register"} />;
}


