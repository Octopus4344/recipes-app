"use client";

import { Button } from "@/components/ui/button";
import { fetchData } from "@/lib/api";
import { FoodPackage } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FoodParcel } from "./components/food-parcel";
import { AddFoodPackageDialog } from "./components/add-food-package";

export default function FoodPackagesPage() {
  const queryClient = useQueryClient();
  const {
    isPending,
    error,
    data: foodPackages,
  } = useQuery<FoodPackage[]>({
    queryKey: ["food-packages"],
    queryFn: async () => {
      return await fetchData("user/food_packages", "GET");
    },
  });
  const mutation = useMutation({
    mutationFn: (name: string) => {
      return fetchData("food_packages", "POST", {
        body: JSON.stringify({ name }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["food-packages"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    },
  });
  const addFoodPackage = (name: string) => {
    mutation.mutate(name);
  };
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return (
    <main className="flex flex-col px-32">
      <h2 className="mb-5 text-3xl font-bold">My food packages</h2>
      <AddFoodPackageDialog
        addFoodPackage={addFoodPackage}
      ></AddFoodPackageDialog>
      <div className="flex flex-wrap gap-4">
        {foodPackages.map((foodPackage) => (
          <FoodParcel
            key={foodPackage.id}
            id={foodPackage.id}
            title={foodPackage.name}
            products={foodPackage.products}
          ></FoodParcel>
        ))}
      </div>
    </main>
  );
}
