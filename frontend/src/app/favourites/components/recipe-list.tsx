"use client";
import { Recipe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { RecipeTile } from "@/components/recipe-tile";

export function RecipeList() {

  const { data: recipes, isLoading: isLoading, isError: isError } = useQuery<Recipe[]>({
    queryKey: ["favourites"],
    queryFn: async () => {
      return await fetchData("user/favourite", "GET");
    }
  });

  if (isError) {
    return <p>Error</p>;
  }

  if (isLoading || !Array.isArray(recipes)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="grid p-16 grid-cols-1 sm:grid-cols-3 space-x-3 gap-3 lg:grid-cols-4">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
              <RecipeTile recipe={recipe} key={recipe.id} />
            ))
        ):(
          <p className="text-gray-500 font-bold text-lg">You have no favourite recipes.</p>
          )
        }

      </div>
    </div>
  );
}