"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Recipe, Review } from "@/lib/types";
import { fetchData } from "@/lib/api";
import Link from "next/link";
import { ArrowLeftIcon, Star } from "lucide-react";
import { Rating } from "react-simple-star-rating";
import { TagList } from "@/components/tag-list";
import { FavouriteToggle } from "@/components/favourite-toggle";
import { ProtectedRoute } from "@/components/protected-route";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { ReviewDialog } from "@/components/review-dialog";
import { useUser } from "@/context/user-context";


export default function RecipeDetailsPage() {
  const recipeId = useParams().recipeId;
  const { user } = useUser();

  const { data: recipe, isLoading: isLoading, isError: isError } = useQuery<Recipe>({
    queryKey: ["recipes"],
    queryFn: async () => {
      return await fetchData(`recipes/${recipeId}`, "GET");
    }
  });

  if (isError) {
    return <p>Error</p>;
  }

  if (isLoading || !recipe) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="flex py-8 px-24 space-x-8 items-start justify-between">
        <div className="flex flex-col">
          <Link href="/" className="flex w-full text-gray-600 py-3">
            <ArrowLeftIcon />
            <p>Back</p>
          </Link>
          {recipe.isProfessional &&
            <div
              className="flex rounded-full text-xs bg-gray-400 text-white p-1 max-w-32 space-x-1.5 my-1.5 items-center justify-center">
              <Star fill="white" color="white" size={10} />
              <p>Professional</p>
            </div>
          }
          <p className="text-3xl font-bold text-transform: uppercase overflow-clip w-[300px]">{recipe.name}</p>
          <div className="flex items-center justify-between w-full">
            <p className="text-primary font-bold">by {recipe.userId}</p>
            <Rating className="inline-flex" size={25} readonly={true} initialValue={recipe.averageRating} />
          </div>
          <div className="flex items-center justify-between w-full mt-8">
            {recipe.tags &&
              <TagList tags={recipe.tags} rows={recipe.tags.length / 3} />}
          </div>
          {user?.role === "amator" &&
            <div
              className="flex items-center justify-center w-full bg-gray-500 rounded-lg p-4 text-white space-x-4 max-w-64 my-4">
              <FavouriteToggle recipe={recipe} color={"white"} />
              {!recipe.isFavourite ? (
                <p>Add to favourites</p>) : (
                <p>Remove from favourites</p>
              )}
            </div>}
          {user?.role === "amator" &&
            <ReviewDialog id={recipe.id} />}

          <div className="flex space-x-1.5 mt-8">
            <p className="font-light text-gray-600">Preparation time: </p>
            <p className="font-bold text-gray-500">{recipe.preparationTime} min</p>
          </div>
          <div className="flex space-x-1.5">
            <p className="font-light text-gray-600">Difficulty level: </p>
            <p className="font-bold text-gray-500">{recipe.difficultyLevel}</p>
          </div>
          <p className="font-bold text-gray-600 text-lg pt-4">Ingredients</p>
          <ScrollArea className="pt-1 text-gray-600 h-[80px]">
            <ol>
              {recipe.ingredients?.map((ingredient) => (
                  <li key={ingredient.id}>
                    {ingredient.name} - {ingredient.calorificValue} kcal
                  </li>
                )
              )}
            </ol>
          </ScrollArea>
        </div>
        <div className="flex flex-col">
          <Image src={recipe.imageUrl || "/placeholder.svg"} alt={"Image of the recipe"} width={600} height={400} />
          <ScrollArea className="pt-1 text-gray-600 h-[80px]">
            <div>{recipe.description}</div>
          </ScrollArea>
          <p className="font-bold text-gray-600 text-lg py-4">Reviews</p>
          <ScrollArea className="pt-1 text-gray-600 h-[80px]">
            <ol>
              {recipe.reviews?.map((review) => (
                  <li key={review.id}>
                    <ReviewComponent review={review} />
                  </li>
                )
              )}
            </ol>
          </ScrollArea>
        </div>

      </div>
    </ProtectedRoute>
  );
}

function ReviewComponent({ review }: { review: Review }) {
  return (
    <div className="flex space-x-1.5 ">
      <div className="flex space-x-3 justify-center items-start">
        <Image alt="Profile photo" src="/profile-pic.svg" width={60} height={60} />
        <div className="flex flex-col">
          <p className="font-bold">{review.amatorId}</p>
          <Rating className="inline-flex" size={25} readonly={true} initialValue={review.grade} />
        </div>
        <ScrollArea className="pt-1 text-gray-600 h-[100px]">
          <div>{review.review}</div>
        </ScrollArea>
      </div>
    </div>
  );
}