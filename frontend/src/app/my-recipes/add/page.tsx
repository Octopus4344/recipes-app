import { ProtectedRoute } from "@/components/protected-route";
import { RecipeEditor } from "@/app/my-recipes/components/recipe-form";

export default function AddRecipePage() {
  return (
    <ProtectedRoute>
      <RecipeEditor/>
    </ProtectedRoute>
  );
}