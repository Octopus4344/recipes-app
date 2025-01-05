"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@/lib/api";


interface UserContextInterface {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextInterface | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within the context");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser){
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  },[])

  useEffect(() => {
    if (user){
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const logoutMutation = useMutation({
    mutationFn: () => fetchData("user/logout", "DELETE"),
    onSuccess: () => {
      clearUser();
      queryClient.clear()
    },
    onError: () => {
      console.error("Error logging out");
    }
  })

  const logout = () => {
    logoutMutation.mutate()
  }

  return (
    <UserContext.Provider value={{ user,  setUser, clearUser, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );

}
