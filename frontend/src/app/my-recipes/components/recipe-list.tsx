"use client";
import { Recipe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { RecipeTile } from "./recipe-tile";
import {
  AlertDialog,
  AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Rating } from "react-simple-star-rating";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function RecipeList() {

  const { data: recipes, isLoading: isLoading, isError: isError } = useQuery<Recipe[]>({
    queryKey: ["my-recipes"],
    queryFn: async () => {
      return await fetchData("user/recipes", "GET");
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
      <div className="flex justify-start items-center gap-8">
        <p className="font-bold text-xl p-8">Your recipes</p>
        <Button asChild={true}>
          <Link href="/my-recipes/add" className="text-white">Add</Link>
        </Button>
      </div>
      {recipes.length > 0 ? (
        <div className="grid p-16 grid-cols-1 sm:grid-cols-3 space-x-3 gap-3 lg:grid-cols-4">
          {recipes.map((recipe) => (
            <AlertDialog key={recipe.id}>
              <AlertDialogTrigger>
                <RecipeTile recipe={recipe} key={recipe.id} />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{recipe.name}</AlertDialogTitle>
                  <AlertDialogDescription asChild={true}>
                    <div className="relative h-48 justify-center">
                      <Image className="rounded-lg" layout="fill" objectFit="cover"
                             src={recipe.imageUrl || "/placeholder.svg"} alt={"Image of the recipe"} />
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction asChild={true}>
                    <Link href={`/my-recipes/edit/${recipe.id}`}>Edit recipe</Link>
                  </AlertDialogAction>
                  <AlertDialogAction asChild={true}>
                    <Link href={`/recipes/${recipe.id}`}>View recipe</Link>
                  </AlertDialogAction>
                  <AlertDialogCancel>Go back</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 font-bold text-lg pt-4  p-8">You have no recipes.</p>
      )
      }

    </div>
  );
}