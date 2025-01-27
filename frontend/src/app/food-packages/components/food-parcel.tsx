import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { fetchData } from "@/lib/api";
import { Product } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisVerticalIcon, PenIcon, TrashIcon } from "lucide-react";
import React from "react";
import Link from "next/link";

export const FoodParcel = ({
  id,
  title,
  products,
}: {
  id: string;
  title: string;
  products: Product[];
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return fetchData(`food_packages/${id}`, "DELETE");
    },
    onSuccess: () => {
      alert("Food package deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["food-packages"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    },
  });
  const handleDelete = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    confirm("Are you sure you want to delete this food package?") &&
      mutation.mutate();
  };
  const numberOfProducts = JSON.parse(
    localStorage.getItem(`food-package-${id}`) || "[]",
  )?.length;
  const tags = JSON.parse(localStorage.getItem(`tags-${id}`) || "[]");
  return (
    <div className="flex h-[150px] w-[350px] flex-col justify-between rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild={true}>
            <Button variant="secondary">
              <EllipsisVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-50">
            <DropdownMenuLabel>Choose action</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/food-packages/${id}`} className="flex w-full gap-2">
                Edit <PenIcon className="size-4" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete()}>
              <span>Delete</span>
              <TrashIcon className="size-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h4>Products: {numberOfProducts ?? 0}</h4>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag: { tag: string; isChecked: boolean }) => {
          return (
            tag.isChecked && (
              <span
                key={tag.tag}
                className="rounded-lg bg-gray-200 p-1 text-xs"
              >
                {tag.tag}
              </span>
            )
          );
        })}
      </div>
    </div>
  );
};
