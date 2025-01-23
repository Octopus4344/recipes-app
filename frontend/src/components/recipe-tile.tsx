"use client"
import { Recipe } from "@/lib/types";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import { FavouriteToggle } from "@/components/favourite-toggle";
import { useUser } from "@/context/user-context";
import { TagList } from "@/components/tag-list";

export function RecipeTile({ recipe }: { recipe: Recipe }) {
  const { user } = useUser();
  return (
    <Link href={`/recipes/${recipe.id}`} className="transition hover:scale-110 max-w-80 h-[480px]">
      <div className="rounded-3xl p-4 shadow-lg h-full">
        <div className="relative w-full h-64">
          <Image className="rounded-lg" layout="fill" objectFit="cover" src={recipe.imageUrl || "/placeholder.svg"} alt={"Image of the recipe"} />
        </div>
        <div className="flex items-center justify-between w-full py-1">
          <p className="text-gray-500 font-bold">by {recipe.userId}</p>
          <Rating className="inline-flex" size={25} readonly={true} initialValue={recipe.averageRating} />
        </div>
        <p className="text-xl font-bold line-clamp-2">{recipe.name}</p>
        <div className="my-4 w-full">
          <TagList tags={[{ id: "1", type: "type", name: "vegetarian" }, {
            id: "3",
            type: "type",
            name: "vegetarian"
          }, { id: "34", type: "type", name: "vegetarian" }, { id: "8", type: "type", name: "vegetarian" }]}
                   rows={1} />
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-gray-400 font-semibold">see more {">"}</p>
          {user?.role === "amator" && <FavouriteToggle recipe={recipe} />}
        </div>
      </div>
    </Link>
  )
}