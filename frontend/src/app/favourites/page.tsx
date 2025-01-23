import { ProtectedRoute } from "@/components/protected-route";
import { RecipeList } from "@/app/favourites/components/recipe-list";

export default function FavouritesPage(){
  return (
    <ProtectedRoute allowedRoles="amator">
      <RecipeList/>
    </ProtectedRoute>
  )
}