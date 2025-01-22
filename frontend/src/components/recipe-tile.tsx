"use client"
import { Recipe } from "@/lib/types";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import { FavouriteToggle } from "@/components/favourite-toggle";
import { useUser } from "@/context/user-context";

export function RecipeTile({ recipe }: { recipe: Recipe }) {
  const { user } = useUser();
  return (
    <Link href={`/recipes/${recipe.id}`} className="transition hover:scale-110 max-w-56">
      <div className="rounded-3xl p-4 shadow-lg">
        <Image src={recipe.imageUrl || "/placeholder.svg"} alt={"Image of the recipe"} width={400} height={400} />
        <div className="flex items-center justify-between w-full py-1">
          <p className="text-gray-500 font-bold">by {recipe.userId}</p>
          <Rating className="inline-flex" size={20} readonly={true} initialValue={recipe.averageRating} />
        </div>
        <p className="text-xl font-bold">{recipe.name}</p>
        <div className="flex items-center justify-between w-full">
          <p className="text-gray-400 text-sm font-semibold">see more {">"}</p>
          {user?.role === "amator" && <FavouriteToggle recipe={recipe} />}
        </div>
      </div>
    </Link>
  )
}