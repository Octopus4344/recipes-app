"use client";
import { Recipe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { RecipeTile } from "@/components/recipe-tile";
import { RecipeOfTheDay } from "@/components/recipe-of-the-day";

export function RecipeList() {

  const { data: recipes, isLoading: isLoading, isError: isError } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: async () => {
      return await fetchData("recipes", "GET");
    }
  });

  if (isError) {
    return <p>Error</p>;
  }

  if (isLoading || !Array.isArray(recipes)) {
    return <div>Loading...</div>;
  }

  if (recipes.length === 0) {
    return <p className="text-gray-500 font-bold text-lg m-10">Sorry! No recipes found for you</p>
  }

  console.log("Recipes",recipes)
  const [recipeOfTheDay, ...remaining] = recipes;


  return (
    <div className="flex flex-col w-full">
      <RecipeOfTheDay recipe={recipeOfTheDay} />
      <div className="grid p-16 grid-cols-1 sm:grid-cols-3 space-x-3 gap-3 lg:grid-cols-4">
        {remaining.map((recipe) => (
          <RecipeTile recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  );
}