"use client"
import {
  AlertDialog,
  AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Rating } from "react-simple-star-rating";
import { useState } from "react";
import { Review } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";
import { useUser } from "@/context/user-context";
import { Textarea } from "@/components/ui/textarea";


export function ReviewDialog({ id }: { id: number }) {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [review, setReview] = useState<Review>({grade: 0, recipeId: ""});
  const [hasError, setHasError] = useState(false);
  const [step, setStep] = useState(0);


  const handleNextStep = () => {
    if (review.grade === 0) {
      setHasError(true);
      setStep(0)
      return;
    }
    setStep(1);
  }

  const handleRating = (rate: number) => {
    setReview((prev) => ({...prev, grade: rate}));
  }

  const mutation = useMutation({
    mutationFn: async () => {
      return await fetchData("reviews", "POST",
        { body: JSON.stringify(review) }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      setStep(0);
      setReview((prev) => ({...prev, grade: 0}));
    },
    onError: (error) => {
      alert(error.message || "Something went wrong");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    if (step === 1 && (!review.review || review.review === "") || review.grade === 0 ) {
      setHasError(true);
      setStep(0);
      setReview((prev) => ({...prev, grade: 0}));
      e.preventDefault();
      return
    }
    if(user?.id && id) {
      setReview((prev) => ({...prev, recipeId: id.toString(), amatorId: user.id.toString()}));
    }
    mutation.mutate()

  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          className="flex items-center justify-center w-full bg-gray-500 rounded-lg p-4 text-white space-x-4 max-w-48">
          <p>Rate this recipe</p>
        </div>
      </AlertDialogTrigger>

      {(step === 0 && !hasError) && (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Please rate this recipe</AlertDialogTitle>
          <AlertDialogDescription>
            <Rating onClick={handleRating}/>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleSubmit}>Confirm</AlertDialogAction>
          <Button onClick={handleNextStep}>Leave a review</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
      )}

      {(step === 1 && !hasError) && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Please rate this recipe</AlertDialogTitle>
            <AlertDialogDescription>
              <Textarea
                id={"review"}
                name={"review"}
                value={review.review}
                required={true}
                onChange={(e) => setReview((prev) => ({...prev, review: e.target.value}))}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmit}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}

      {(hasError) && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You haven&#39;t provided all necessary data!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setHasError(false)}>Go back</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}

    </AlertDialog>

  );
}