"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  allowedRoles?: "amator" | "restaurant" | "cook" | "foodProducer";
}

export function ProtectedRoute(props: Props) {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
        return;
      }

      if (props.allowedRoles && !props.allowedRoles.includes(user.role)) {
        // tu bedzie jakas strona moze do tego
        router.replace("/login");
        return;
      }
    }
  }, [user, isLoading]);

  //suspensea tez mozna zrobic ladniejszego
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{props.children}</>;
}