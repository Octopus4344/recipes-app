"use client"
import { useParams } from "next/navigation";

export default function EditRecipePage() {
  const recipeId = useParams().recipeId;
  return <div>Edit Recipe</div>;
}