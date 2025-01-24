"use client"
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { RecipeList } from "@/components/recipe-list";
import { RecipeEditor } from "@/app/my-recipes/components/recipe-form";

export default function EditRecipePage() {
  const recipeId = useParams().recipeId;
  return(
    <ProtectedRoute>
      <RecipeEditor recipeId={Number(recipeId)} />
    </ProtectedRoute>);
}