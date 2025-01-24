"use client"
import { useUser } from "@/context/user-context";
import { ProtectedRoute } from "@/components/protected-route";
import { CategoriesDataDisplay } from "@/app/my-profile/components/profile-chooser";

export default function RegisterPage() {
  const { user } = useUser();
  return (
    <ProtectedRoute>
      <CategoriesDataDisplay/>
    </ProtectedRoute>
  )
    ;
}