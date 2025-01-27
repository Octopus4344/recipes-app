"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchData } from "@/lib/api";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const TAGS = [
  "Vegan",
  "Lactose free",
  "Halal",
  "Nut free",
  "Gluten free",
  "Low carb",
  "Sugar free",
  "High fiber",
];

export default function FoodPackagesPage() {
  const { id } = useParams<{ id: string }>();
  const { value: products, setNewValue: setProducts } = useLocalStorage<
    { name: string; productId: string }[]
  >(
    `food-package-${id}`,
    React.useMemo(() => [], []),
  );
  const { value: tags, setNewValue: setTags } = useLocalStorage<
    { tag: string; isChecked: boolean }[]
  >(
    `tags-${id}`,
    React.useMemo(
      () =>
        TAGS.map((tag) => {
          return { tag: tag, isChecked: false };
        }),
      [],
    ),
  );
  const packageName = React.useRef<HTMLInputElement | null>(null);
  const onProductChange = (id: string, value: string) => {
    const newProducts = products.map((product) => {
      if (product.productId === id) {
        return { ...product, name: value };
      }
      return product;
    });
    setProducts(newProducts);
  };
  const { isPending, data: name } = useQuery<{ name: string }>({
    queryKey: [`food-packages-${id}`],
    queryFn: async () => {
      return await fetchData(`food_packages/${id}`, "GET");
    },
  });
  const mutation = useMutation({
    mutationFn: (name: string) => {
      return fetchData(`food_packages/${id}`, "PUT", {
        body: JSON.stringify({ name }),
      });
    },
    onSuccess: () => {
      alert("Food package updated successfully");
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    },
  });
  const onSubmit = () => {
    mutation.mutate(packageName.current?.value ?? "");
  };
  return (
    <div className="w-full px-32">
      <h1 className="mb-10 text-3xl font-bold">Package details</h1>
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Package name</Label>
          {isPending && <div>Loading...</div>}
          {!isPending && (
            <Input
              defaultValue={name[0].name}
              ref={packageName}
              id="name"
              className="w-[350px]"
            />
          )}
        </div>
      </div>
      <h2 className="mt-4 text-2xl">Products</h2>
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-4">
          {products.map((product, index) => {
            return (
              <div key={product.productId} className="flex flex-col gap-1">
                <Label htmlFor={product.productId}>Product {index + 1}</Label>
                <Input
                  id={product.productId}
                  value={product.name}
                  onChange={(e) =>
                    onProductChange(product.productId, e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>
        <Button
          onClick={() =>
            setProducts([
              ...products,
              { name: "new product", productId: crypto.randomUUID() },
            ])
          }
          className="mt-4"
        >
          Add product
        </Button>
        <h2 className="mt-4 text-2xl">Tags</h2>
        <div className="flex flex-col gap-4">
          {tags.map((tag) => {
            return (
              <div key={tag.tag} className="flex items-center gap-2">
                <Checkbox
                  id={tag.tag}
                  checked={tag.isChecked}
                  onCheckedChange={() => {
                    const newTags = tags.map((t) => {
                      if (t.tag === tag.tag) {
                        return { ...t, isChecked: !t.isChecked };
                      }
                      return t;
                    });
                    setTags(newTags);
                  }}
                />
                <Label htmlFor={tag.tag}>{tag.tag}</Label>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex items-center gap-4">
          <Button asChild>
            <Link href={"/food-packages"}>Cancel</Link>
          </Button>
          <Button onClick={onSubmit}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}
