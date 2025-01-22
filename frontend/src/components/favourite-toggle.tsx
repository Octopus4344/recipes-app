"use client"
import { Recipe } from "@/lib/types";
import { Heart } from 'lucide-react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";

export function FavouriteToggle({ recipe }: { recipe: Recipe }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (method: "POST" | "DELETE") => {
      return await fetchData("user/favourite", method,
        { body: JSON.stringify({ recipeId: recipe.id }) }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipe.isFavourite){
      mutation.mutate("DELETE");
    }
    else mutation.mutate("POST")
  };



  return (
    <button type="submit" onClick={handleSubmit}>
      {recipe.isFavourite ? (
        <Heart fill="grey" color="grey"/> ):(
        <Heart color="grey"/>)
      }
    </button>
  )
}