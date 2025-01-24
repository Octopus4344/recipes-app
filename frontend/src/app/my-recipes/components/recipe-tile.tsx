"use client"
import { Recipe } from "@/lib/types";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { TagList } from "@/components/tag-list";

export function RecipeTile({ recipe }: { recipe: Recipe }) {
  return (
      <div className="rounded-3xl p-4 shadow-lg transition hover:scale-110 max-w-80 h-[480px]">
        <div className="relative w-full h-64">
          <Image className="rounded-lg" layout="fill" objectFit="cover" src={recipe.imageUrl || "/placeholder.svg"} alt={"Image of the recipe"} />
        </div>
        <div className="flex items-center justify-between w-full py-1">
          <p className="text-gray-500 font-bold">by Me</p>
          <Rating className="inline-flex" size={25} readonly={true} initialValue={recipe.averageRating} />
        </div>
        <p className="text-xl font-bold line-clamp-2">{recipe.name}</p>
        <div className="my-4 w-full">
          {recipe.tags && (
            <TagList tags={recipe.tags} rows={1} />
          )}
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-gray-400 font-semibold">see more {">"}</p>
        </div>
      </div>

  )
}