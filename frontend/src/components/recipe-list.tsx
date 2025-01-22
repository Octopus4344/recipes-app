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

  if (isLoading || !recipes) {
    return <div>Loading...</div>;
  }

  console.log(recipes, isLoading, isError);

  const [recipeOfTheDay, ...remaining] = recipes;

  return (
    <div className="flex flex-col">
      <RecipeOfTheDay recipe={recipeOfTheDay} />
      <div className="grid">
        {remaining.map((recipe) => (
          <RecipeTile recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  );
}