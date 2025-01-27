"use client"
import { ProtectedRoute } from "@/components/protected-route";
import { RecipeList } from "@/components/recipe-list";

export default function Home() {

  return (
    <ProtectedRoute>
      <RecipeList/>
    </ProtectedRoute>
  );
}
