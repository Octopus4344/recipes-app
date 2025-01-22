import { Recipe } from "@/lib/types";

export function RecipeTile({ recipe }: { recipe: Recipe }) {
  return (
    <div className="recipe-tile">
      {recipe.name}
    </div>
  )
}