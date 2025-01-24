"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category, Ingredient, Product, Recipe, Review } from "@/lib/types";
import { fetchData } from "@/lib/api";
import Link from "next/link";
import { ArrowLeftIcon, TrashIcon } from "lucide-react";
import { Rating } from "react-simple-star-rating";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useUser } from "@/context/user-context";
import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { ProductTile } from "@/app/my-recipes/components/product-tile";


export function RecipeEditor({ recipeId }: { recipeId?: number }) {

  const [recipeData, setRecipeData] = useState<Recipe>({
    averageRating: 0,
    createdAt: "",
    description: "",
    difficultyLevel: 0,
    id: 1,
    imageUrl: "",
    ingredients: [],
    isActive: false,
    isFavourite: false,
    isProfessional: false,
    name: "",
    preparationTime: 0,
    reviews: [],
    tags: [],
    updatedAt: "",
    userId: 0
  });

  const [currentStep, setStep] = useState(1);

  const { data: recipe, isLoading: isLoading, isError: isError } = useQuery<Recipe>({
    queryKey: ["recipe"],
    queryFn: async () => {
      return await fetchData(`recipes/${recipeId}`, "GET");
    },
    enabled: !!recipeId
  });

  useEffect(() => {
    if (recipeId) {
      if (recipe) {
        setRecipeData(
          recipe
        );
      }
    }
  }, [recipe, recipeId]);

  if (recipeId && isError) {
    return <p>Error</p>;
  }

  if (recipeId && (isLoading || !recipe)) {
    return <div>Loading...</div>;
  }


  return (
    <>
      {currentStep === 1 ? (
        <RecipeDataEditor recipe={recipeData} setRecipe={setRecipeData} setStep={setStep} edit={!!recipeId} />
      ) : (
        <>
          {currentStep === 2 ? (
            <IngredientsDataEditor recipe={recipeData} setStep={setStep} edit={!!recipeId} />
          ) : (
            <>
              {currentStep === 3 ? (
                <CategoriesDataEditor recipe={recipeData} setStep={setStep} edit={!!recipeId} />
              ) : (
                <>
                  {currentStep === 4 ? (
                    <ProductsDataEditor recipe={recipeData} edit={!!recipeId} />
                  ) : <div />}
                </>
              )}
            </>
          )}
        </>

      )}
    </>
  );
}

function RecipeDataEditor({ recipe, setRecipe, setStep, edit }: {
  recipe: Recipe,
  setRecipe: (recipe: (prev: Recipe) => {
    difficultyLevel: number;
    preparationTime: number;
    description: string;
    isActive?: boolean;
    userId: number;
    tags?: Category[];
    createdAt?: string;
    reviews?: Review[];
    isProfessional: boolean;
    imageUrl: string;
    averageRating?: number;
    name: string;
    ingredients?: Ingredient[];
    id: 1;
    isFavourite?: boolean;
    updatedAt?: string
  }) => void,
  setStep: (step: number) => void,
  edit: boolean
}) {
  const { user } = useUser();
  const queryClient = useQueryClient();


  const mutation = useMutation({
    mutationFn: async ({ payload }: {
      payload: {
        difficultyLevel: number;
        preparationTime: number;
        description: string;
        isActive?: boolean;
        userId: number;
        isProfessional: boolean;
        imageUrl: string;
        name: string;
      }
    }) => {
      return await fetchData(edit ? `recipes/${recipe.id}` : "recipes", edit ? "PUT" : "POST",
        { body: JSON.stringify(payload) }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recipe"] });
      console.log(data);
      setRecipe(data.recipe);
      setStep(2);
    },
    onError: (error) => {
      alert(error.message || "Data incomplete");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    if (user?.id && (user.role === "amator" || user.role === "restaurant")) {
      const payload = {
        difficultyLevel: recipe.difficultyLevel,
        preparationTime: recipe.preparationTime,
        description: recipe.description,
        isActive: true,
        userId: Number(user.id),
        isProfessional: user.role !== "amator",
        imageUrl: recipe.imageUrl,
        name: recipe.name
      };
      if (user.role === "restaurant" && !edit) {
        if (confirm("Are you sure you want to add this \n" +
          "recipe? According to our policies your restaurant will be\n" +
          "obligated to serve your active recipes. Do you want\n" +
          "to add this recipe?")) {
          mutation.mutate({ payload });
        }
      } else mutation.mutate({ payload });
    } else {
      alert("You can't add any recipes");
    }


  };

  return (
    <div className="flex py-8 px-24 space-x-8 space-y-4 items-start justify-between">
      <div className="flex flex-col">
        <Link href="/my-recipes" className="flex w-full text-gray-600 py-3">
          <ArrowLeftIcon />
          <p>Back</p>
        </Link>
        <p className="text-xl font-bold ">{edit ? "Edit recipe" : "Add new recipe"}</p>
        <Card className="mt-8">
          <CardContent>
            <div className="flex flex-col space-y-1.5 m-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id={"name"}
                name={"name"}
                value={recipe.name}
                type="text"
                required={true}
                onChange={(e) => setRecipe((prev: Recipe) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="flex flex-col space-y-1.5 m-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id={"description"}
                name={"description"}
                value={recipe.description}
                required={true}
                onChange={(e) => setRecipe((prev: Recipe) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex flex-col space-y-1.5 m-4">
              <div className="flex flex-col space-y-1.5 m-4">
                <Label htmlFor="difficulty">Difficulty level</Label>
                <p id={"difficulty"} className="p-2 rounded border-gray-300 border-[0.5px]">{recipe.difficultyLevel}</p>
              </div>
              <Slider
                id={"description"}
                max={5}
                defaultValue={[recipe.difficultyLevel]}
                step={1}
                onValueChange={(e) => setRecipe((prev: Recipe) => ({ ...prev, difficultyLevel: e[0] }))}
              />
            </div>
            <div className="flex flex-col space-y-1.5 m-4">
              <div className="flex flex-col space-y-1.5 m-4">
                <Label htmlFor="preparation">Preparation Time</Label>
                <p id={"preparation"}
                   className="p-2 rounded border-gray-300 border-[0.5px]">{recipe.preparationTime} min</p>
              </div>
              <Input
                id={"preparation"}
                name={"preparation"}
                value={recipe.preparationTime}
                type={"time"}
                required={true}
                onChange={(e) => {
                  const time = e.target.value.split(":");
                  const hours = parseInt(time[0], 10);
                  const minutes = parseInt(time[1], 10);
                  const prepTime = hours * 60 + minutes;
                  setRecipe((prev: Recipe) => ({ ...prev, preparationTime: prepTime }));
                }
                }
              />
            </div>
          </CardContent>
        </Card>

      </div>
      <div className="flex flex-col">
        <p className="font-bold text-lg py-4">Photo</p>
        <div className="flex flex-col space-y-1.5 m-4">
          <Label htmlFor="imageUrl">Photo</Label>
          <Input
            id={"imageUrl"}
            name={"imageUrl"}
            value={recipe.imageUrl}
            placeholder={"Photo url..."}
            type={"url"}
            required={true}
            onChange={(e) => setRecipe((prev: Recipe) => ({ ...prev, imageUrl: e.target.value }))
            }
          />
          <Image src={recipe.imageUrl || "/placeholder.svg"} alt={"Image of the recipe"} width={600} height={400} />
          <Button className="max-w-36" onClick={handleSubmit}>Next</Button>
        </div>
      </div>
    </div>
  )
    ;
}

function IngredientsDataEditor({ recipe, edit, setStep }: {
  recipe: Recipe,
  setStep: (step: number) => void
  edit: boolean,
}) {
  const [curr, setCurr] = useState<Ingredient>({ calorificValue: 0, id: 0, name: "" });
  const queryClient = useQueryClient();

  const { data: ingredients, isLoading: isLoading, isError: isError } = useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      return await fetchData(`recipe_ingredients/${recipe.id}`, "GET");
    }
  });

  const deletion = useMutation({
    mutationFn: async ({ params }: {
      params: {
        id: number
      }
    }) => {
      return await fetchData(`recipe_ingredients/${params.id}`, "DELETE"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    }
  });

  const mutation = useMutation({
    mutationFn: async ({ payload }: {
      payload: {
        calorific_value: number
        name: string;
      }
    }) => {
      return await fetchData(`recipe_ingredients/${recipe.id}`, "POST",
        { body: JSON.stringify(payload) }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    }
  });

  if (isError) {
    return <p>Error</p>;
  }

  if (isLoading || !ingredients) {
    return <div>Loading...</div>;
  }


  const handleDelete = async (id: number) => {
    const params = {
      id: id
    };
    deletion.mutate({ params });

  };

  const handleAdd = async (e: React.FormEvent) => {
    const payload = {
      calorific_value: curr.calorificValue,
      name: curr.name
    };
    mutation.mutate({ payload });

  };

  const handleNext = () => {
    console.log("qqq");
    if (ingredients.length < 1) {
      alert("Choose at least one ingredient");
      return;
    }
    setStep(3);
    console.log("ggg");
  };

  return (
    <div className="flex py-8 px-24 space-x-8 space-y-4 items-center justify-between">
      <div className="flex flex-col">
        <Link href="/my-recipes" className="flex w-full text-gray-600 py-3">
          <ArrowLeftIcon />
          <p>Back</p>
        </Link>
        <Card className="mt-8">
          <CardContent>
            <div className="flex">
              <div className="flex flex-col">
                <p className="font-bold text-lg py-4">Ingredients</p>
                <div className="flex flex-col space-y-1.5 m-4">
                  <Input
                    id={"name"}
                    name={"name"}
                    value={curr.name}
                    placeholder={"Ingredient name"}
                    type="text"
                    required={true}
                    onChange={(e) => setCurr((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="flex space-x-1.5 m-4">
                  <Input
                    id={"calorific"}
                    name={"calorific"}
                    value={curr.calorificValue}
                    step={1}
                    type="number"
                    required={true}
                    onChange={(e) => setCurr((prev) => ({ ...prev, calorificValue: Number(e.target.value) }))}
                  />
                  <p>kcal</p>
                </div>
                <Button className="mx-4" onClick={handleAdd}>Add</Button>
              </div>
              <ScrollArea className="m-10 text-gray-600 h-[150px] ">
                <ol>
                  {ingredients.map((ingredient) => (
                      <li key={ingredient.id}>
                        {ingredient.name} - {ingredient.calorificValue} kcal
                        <Button variant="ghost" onClick={() => handleDelete(ingredient.id)}>
                          <TrashIcon />
                        </Button>
                      </li>
                    )
                  )}
                </ol>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
        <Button className="max-w-36" onClick={() => handleNext()}>Next</Button>
      </div>
    </div>
  )
    ;
}

function CategoriesDataEditor({ recipe, setStep, edit }: {
  recipe: Recipe,
  setStep: (step: number) => void
  edit: boolean,
}) {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const router = useRouter();

  const { data: categories, isLoading: isLoading, isError: isError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      return await fetchData(`recipes_tags/categories/${recipe.id}`, "GET");
    }
  });



  const mutation = useMutation({
    mutationFn: async ({ payload, method }: {
      payload: {
        categories: number[],
      },
      method: "POST" | "DELETE"
    }) => {
      return await fetchData(`recipes_tags/${recipe.id}`, method,
        { body: JSON.stringify(payload) }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    }
  });

  if (isError) {
    return <p>Error</p>;
  }

  if (isLoading || !categories) {
    return <div>Loading...</div>;
  }


  const handleDelete = async (id: number) => {
    const payload = {
      categories: [id]
    };
    mutation.mutate({ payload, method: "DELETE" });

  };

  const handleAdd = async (id: number) => {
    const payload = {
      categories: [id]
    };
    mutation.mutate({ payload, method: "POST" });
  };

  const handleNext = () => {
    if (categories.filter((category) => category.isAdded).length < 1) {
      alert("Choose at least one category");
      return;
    }
    if (user?.role === "amator") setStep(4);
    else {
      alert(edit ? "Data has been changed" : "Recipe created successfully");
      router.push("/my-recipes");
    }
  };

  const MyColumn = ({ type }: {
    type: "type_of_diet"
      |
      "type_of_meal" | "other";
  }) => {
    console.log(categories)
    const filteredCategories = categories.filter(category => category.type === type);

    return (
      <div className="flex flex-col mx-8">
        <p className="font-bold text-lg py-4">{type}</p>
        <ul className="flex flex-col space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.id} className="flex space-x-1.5 items-center">
              <Checkbox key={category.id} id={"category" + category.id} checked={category.isAdded} onClick={category.isAdded ? () => handleDelete(Number(category.id)) : () => handleAdd(Number(category.id))} />
              <Label className="text-lg" htmlFor={"category" + category.id}>{category.name}</Label>
            </div>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
    <div className="flex justify-center gap-3.5">
    <MyColumn type={"type_of_diet"}></MyColumn>
    <MyColumn type={"type_of_meal"}></MyColumn>
    <MyColumn type={"other"}></MyColumn>
    </div>
      <Button onClick={() => handleNext()}>Next</Button>
    </div>
  );
}

function ProductsDataEditor({ recipe, edit }: {
  recipe: Recipe,
  edit: boolean,
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: ingredients, isLoading: isLoading, isError: isError } = useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      return await fetchData(`ingredient_products/${recipe.id}`, "GET");
    }
  });

  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      return await fetchData(`products`, "GET");
    }
  });


  const mutation = useMutation({
    mutationFn: async ({ payload, method }: {
      payload: {
        productId: number,
        ingredientId: number,
      },
      method: "POST" | "DELETE"
    }) => {
      return await fetchData(`ingredient_products/${payload.ingredientId}`, method,
        { body: JSON.stringify({ productId: payload.productId }) },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ingredients"] });
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    }
  });

  if (isError || isErrorProducts) {
    return <p>Error</p>;
  }

  if (isLoading || isLoadingProducts || !products || !ingredients) {
    return <div>Loading...</div>;
  }


  const handleDelete = async (ingredientId: number, productId: number) => {
    const payload = {
      productId: productId,
      ingredientId: ingredientId

    };
    mutation.mutate({ payload, method: "DELETE" });
  };

  const handleAdd = async (ingredientId: number, productId: number) => {
    const payload = {
      productId: productId,
      ingredientId: ingredientId

    };
    mutation.mutate({ payload, method: "POST" });
  };

  const handleNext = () => {
      alert(edit ? "Data has been changed" : "Recipe created successfully");
      router.push("/my-recipes");
  };


  return (
    <div className="flex flex-col justify-center gap-3.5 m-8">
      <p className="text-xl font-bold ">{edit ? "Edit products" : "Add products"}</p>
      <div className="flex gap-3.5">
        <Card className="min-w-48 p-4">
          <CardTitle className="text-md">Added</CardTitle>
          <CardContent>
            <ScrollArea>
              {ingredients.map((ingredient) => (
                (ingredient.product && (
                    <div className="flex justify-center items-center" key={ingredient.id}>
                      <p
                        key={ingredient.id}>{ingredient.name} - {ingredient.product.name} ({ingredient.product.producerId})
                      </p>
                      <Button variant="ghost" onClick={() => handleDelete(ingredient.id, Number(ingredient.product?.id))}>
                        <TrashIcon />
                      </Button>
                    </div>
                  )
                )
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Button onClick={() => handleNext()}>Confirm</Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductTile product={product} key={product.id} ingredients={ingredients} handleAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
}


