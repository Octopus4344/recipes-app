import { ProtectedRoute } from "@/components/protected-route";
import { RecipeList } from "@/app/my-recipes/components/recipe-list";

export default function MyRecipePage() {
  return (
    <ProtectedRoute>
      <RecipeList />
    </ProtectedRoute>
  )
}