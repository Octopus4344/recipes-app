import { Recipe } from "@/lib/types";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";

export function RecipeOfTheDay({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex items-center justify-center w-full px-36 space-x-8">
      <div className="flex items-start justify-start flex-col w-[300px]">
        <p className="text-xl font-bold">Recipe of the day</p>
        <p className="text-3xl font-bold text-transform: uppercase">{recipe.name}</p>
        <div className="flex items-center justify-between w-full">
          <p className="text-primary font-bold">by {recipe.userId}</p>
          <Rating className="inline-flex" size={25} readonly={true} initialValue={recipe.averageRating} />
        </div>
      </div>
      <Image src={recipe.imageUrl || "/placeholder.svg"} alt={"Image of the recipe"} width={400} height={400} />
    </div>
  )
}