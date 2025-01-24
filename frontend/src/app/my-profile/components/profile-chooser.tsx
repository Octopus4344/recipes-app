import { Category } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export function CategoriesDataDisplay() {

  const { data: categories, isLoading: isLoading, isError: isError } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      return await fetchData(`user/nutritional_profiles`, "GET");
    }
  });

  if (isError) {
    return <p>Error</p>;
  }

  if (isLoading || !categories) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 flex-col items-center justify-center gap-8">
      <p className="font-bold text-3xl py-4">Your nutritional profile</p>
      <div className="grid grid-cols-3 lg:grid-cols-5 p-4 rounded-lg shadow-lg gap-3.5 m-10">
        {categories.filter((cat) => cat.isAdded).map((category) => (
          <div key={category.id} className="py-1 bg-primary flex text-white text-xl justify-center items-center rounded-full max-w-48">
            {category.name}
          </div>
        ))}
      </div>
      <CategoryEditor categories={categories}/>
    </div>
  )

}

function CategoryEditor({categories}: {categories: Category[]}) {
  const [toAdd, setToAdd] = useState<number[]>([]);
  const [toDelete, setToDelete] = useState<number[]>([]);
  const [editedCategories, setEditedCategories] = useState<Category[]>(categories);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload, method }: {
      payload: {
        categoryId: number,
      },
      method: "POST" | "DELETE"
    }) => {
      return await fetchData(`user/nutritional_profiles`, method,
        { body: JSON.stringify(payload) }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error(error.message || "Something went wrong");
    }
  });

  const handleDelete = (id: number) => {
    setToAdd((prev) => prev.filter((category) => category !== id))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setEditedCategories((prev) => prev.map((category) => category.id === id ? {...category, isAdded: false} : category));
    setToDelete((prev) => prev.includes(id) ? prev : [...prev, id]);
  }

  const handleAdd = (id: number) => {
    console.log(id);
    setToDelete((prev) => prev.filter((category) => category !== id))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if(categories.find((category) => category.id === id && !category.isAdded)){
      setToAdd((prev) => prev.includes(id) ? prev : [...prev, id]);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setEditedCategories((prev) => prev.map((category) => category.id === id ? {...category, isAdded: true} : category));

  }

  const handleCancel = () => {
    setEditedCategories(categories)
    setToDelete([])
    setToAdd([])
  }

  const handleSubmit = async () => {
    console.log("deleting",toDelete);
    toDelete.forEach((id) => {
      console.log("deleting",id);
      const payload = {
        categoryId: id
      };
      mutation.mutate({ payload, method: "DELETE" });
    })
    console.log("adding",toAdd);
    toAdd.forEach((id) => {
      console.log("adding",id);
      const payload = {
        categoryId: id
      };
      mutation.mutate({ payload, method: "POST" });
    })
    setToDelete([])
    setToAdd([])

  };

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg shadow-lg max-w-[400px]">
      <p className="font-bold text-lg py-4">Edit your nutritional profile</p>
      <div className="flex justify-center gap-3.5 w-full">
        <div className="grid grid-cols-3 w-full">
          <ul className="flex flex-col space-y-4">
            {editedCategories.map((category) => (
              <div key={category.id} className="flex space-x-1.5 items-center">
                <Checkbox key={category.id} id={"category" + category.id} checked={category.isAdded}
                          onClick={category.isAdded ? () => handleDelete(Number(category.id)) : () => handleAdd(Number(category.id))} />
                <Label className="text-lg" htmlFor={"category" + category.id}>{category.name}</Label>
              </div>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex w-full py-4 justify-between">
      <Button onClick={() => handleSubmit()}>Complete</Button>
      <Button onClick={() => handleCancel()}>Cancel</Button></div>
    </div>
  );
}


