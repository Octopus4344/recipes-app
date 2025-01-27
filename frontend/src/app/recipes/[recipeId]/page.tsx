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

  const {
    data: recipe,
    isLoading: isLoading,
    isError: isError,
  } = useQuery<Recipe>({
    queryKey: ["recipes"],
    queryFn: async () => {
      return await fetchData(`recipes/${recipeId}`, "GET");
    },
  });
  if (isError) {
    return <p>Error</p>;
  }

  if (isLoading || !recipe) {
    return <div>Loading...</div>;
  }
  return (
    <ProtectedRoute>
      <div className="flex items-start justify-center space-x-24 px-48 py-8">
        <div className="flex flex-col">
          <Link href="/" className="flex w-full py-3 text-gray-600">
            <ArrowLeftIcon />
            <p>Back</p>
          </Link>
          {recipe.isProfessional && (
            <div className="my-1.5 flex max-w-32 items-center justify-center space-x-1.5 rounded-full bg-gray-400 p-1 text-xs text-white">
              <Star fill="white" color="white" size={10} />
              <p>Professional</p>
            </div>
          )}
          <p className="text-transform: w-[300px] overflow-clip text-3xl font-bold uppercase">
            {recipe.name}
          </p>
          <div className="flex w-full items-center justify-between">
            <p className="font-bold text-primary">by {recipe.userId}</p>
            <Rating
              className="inline-flex"
              size={25}
              readonly={true}
              initialValue={recipe.averageRating}
            />
          </div>
          <div className="mt-8 flex w-full items-center justify-between">
            {recipe.tags && (
              <TagList tags={recipe.tags} rows={recipe.tags.length / 3} />
            )}
          </div>
          {user?.role === "amator" && (
            <div className="my-4 flex w-full max-w-64 items-center justify-center space-x-4 rounded-lg bg-gray-500 p-4 text-white">
              <FavouriteToggle recipe={recipe} color={"white"} />
              {!recipe.isFavourite ? (
                <p>Add to favourites</p>
              ) : (
                <p>Remove from favourites</p>
              )}
            </div>
          )}
          {user?.role === "amator" && <ReviewDialog id={recipe.id} />}

          <div className="mt-8 flex space-x-1.5">
            <p className="font-light text-gray-600">Preparation time: </p>
            <p className="font-bold text-gray-500">
              {recipe.preparationTime} min
            </p>
          </div>
          <div className="flex space-x-1.5">
            <p className="font-light text-gray-600">Difficulty level: </p>
            <p className="font-bold text-gray-500">{recipe.difficultyLevel}</p>
          </div>
          <p className="pt-4 text-lg font-bold text-gray-600">Ingredients</p>
          <ScrollArea className="h-[80px] pt-1 text-gray-600">
            <ol>
              {recipe.ingredients?.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.name} - {ingredient.calorificValue} kcal
                </li>
              ))}
            </ol>
          </ScrollArea>
          <p className="pt-4 text-lg font-bold text-gray-600">Products</p>
          {recipe.products?.map((product) => {
            return (
              <div key={product.name}>
                {product.name}({product.producer?.name})
              </div>
            );
          })}
        </div>
        <div className="flex flex-col">
          <Image
            src={recipe.imageUrl || "/placeholder.svg"}
            alt={"Image of the recipe"}
            width={600}
            height={400}
            style={{ objectFit: "cover" }}
          />
          <ScrollArea className="h-[80px] pt-1 text-gray-600">
            <div>{recipe.description}</div>
          </ScrollArea>
          <p className="py-4 text-lg font-bold text-gray-600">Reviews</p>
          <ScrollArea className="h-[150px] pt-1 text-gray-600">
            <ol>
              {recipe.reviews?.map((review) => (
                <li key={review.id}>
                  <ReviewComponent review={review} />
                </li>
              ))}
            </ol>
          </ScrollArea>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function ReviewComponent({ review }: { review: Review }) {
  return (
    <div className="flex space-x-1.5">
      <div className="flex items-start justify-center space-x-3">
        <Image
          alt="Profile photo"
          src="/profile-pic.svg"
          width={60}
          height={60}
        />
        <div className="flex flex-col">
          <p className="font-bold">{review.amatorId}</p>
          <Rating
            className="inline-flex"
            size={25}
            readonly={true}
            initialValue={review.grade}
          />
        </div>
        <ScrollArea className="h-[100px] pt-1 text-gray-600">
          <div>{review.review}</div>
        </ScrollArea>
      </div>
    </div>
  );
}
