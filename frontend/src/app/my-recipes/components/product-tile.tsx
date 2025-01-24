"use client";
import { Ingredient, Product } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export function ProductTile({ product, ingredients, handleAdd }: {
  product: Product,
  ingredients: Ingredient[],
  handleAdd(ingredientId: number, productId: number): Promise<void>
}) {
  const linkedIngredients = ingredients.find((ingredient) => ingredient.product?.id === product.id);
  const [selectedIngredient, setSelectedIngredient] = useState<number | null>(
    linkedIngredients ? linkedIngredients.id : null
  );

  const handleSelectedChange = (id: number) => {
    setSelectedIngredient(id);
  };
  console.log(ingredients);

  return (
    <div className="rounded-3xl p-4 shadow-lg transition hover:scale-110 max-w-80 h-[400]px]">
      <div className="relative w-full h-64">
        <Image className="rounded-lg" layout="fill" objectFit="cover" src={product.imageUrl || "/placeholder.svg"}
               alt={"Image of the recipe"} />
      </div>
      <div className="flex items-center justify-between w-full py-1">
        <p className="text-gray-500 font-bold">by {product.producerId}</p>
      </div>
      <p className="text-xl font-bold line-clamp-2">{product.name}</p>
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>Add</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Connect product with an ingredient</AlertDialogTitle>
          <Select onValueChange={(value) => handleSelectedChange(Number(value))}
                  value={selectedIngredient ? String(selectedIngredient) : ""}
                  disabled={!!linkedIngredients}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose ingredient" />
            </SelectTrigger>
            <SelectContent>
              {ingredients.map((ingredient) => (
                <SelectItem key={ingredient.id} value={String(ingredient.id)}>
                  {ingredient.name}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => handleAdd(Number(selectedIngredient),Number(product.id))}>Accept</AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>

  );
}