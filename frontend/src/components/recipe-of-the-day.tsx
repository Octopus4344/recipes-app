"use client"
import { Recipe } from "@/lib/types";
import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { TagList } from "@/components/tag-list";
import Link from "next/link";
import { FavouriteToggle } from "@/components/favourite-toggle";
import { useUser } from "@/context/user-context";

export function RecipeOfTheDay({ recipe }: { recipe: Recipe }) {
  const { user } = useUser();
  return (
    <div className="flex items-center justify-center w-full px-36 space-x-8 h-[250px]">
      <div className="flex items-start justify-between flex-col w-[300px] h-full">
        <div className="w-[300px]">
          <p className="text-xl font-bold">Recipe of the day</p>
          <p className="text-3xl font-bold text-transform: uppercase overflow-clip w-[300px]">{recipe.name}</p>
          <div className="flex items-center justify-between w-full">
            <p className="text-primary font-bold">by {recipe.userId}</p>
            <Rating className="inline-flex" size={25} readonly={true} initialValue={recipe.averageRating} />
          </div>
          <div className="my-4 w-full">
            <TagList tags={[{ id: "1", type: "type", name: "vegetarian" }, {
              id: "3",
              type: "type",
              name: "vegetarian"
            }, { id: "4", type: "type", name: "vegetarian" }, { id: "8", type: "type", name: "vegetarian" }]}
                     rows={1} />
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <Link href={`/recipes/${recipe.id}`} className="text-gray-400 font-semibold">see more {">"}</Link>
          {user?.role === "amator" && <FavouriteToggle recipe={recipe} />}
        </div>
      </div>
      <Image src={recipe.imageUrl || "/placeholder.svg"} alt={"Image of the recipe"} width={400} height={400} />
    </div>
  );
}