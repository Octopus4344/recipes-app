"use client";

import { JSX, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { fetchData } from "@/lib/api";
import { User } from "@/lib/types";

interface LoginInput {
  email: string;
  password: string;
}

interface AuthProps {
  endpoint: string;
  current: string;
  alt: string;
  path: string;
}

export function AuthForm({ endpoint, current, alt, path }: AuthProps): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();


  const mutation = useMutation<User, Error, LoginInput>({
    mutationFn: async (credentials: { email: string, password: string }) => {
      return await fetchData(endpoint, "POST",
        { body: JSON.stringify(credentials) }
      );
    },
    onSuccess: (data: User) => {
      setUser(data);
    },
    onError: (error: any) => {
      if (error.validationError){
        alert(error.validationError.message || "Validation Error");
      }
      else {
        alert(error.message || "Something went wrong");
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email: email, password: password });
  };

  return (
    <div>
      <div className={"flex justify-center items-center mt-4"}>
        <Card className="w-[650px]">
          <CardHeader>
            <CardTitle>{current}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-1.5 m-4">
                <Label htmlFor="login">Login</Label>
                <Input
                  id={"login"}
                  name={"login"}
                  value={email}
                  type="text"
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5 m-4">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  id={"password"}
                  name={"password"}
                  value={password}
                  type="password"
                  step={0.01}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                />
              </div>
            </form>
            <CardFooter className="flex justify-center space-x-8">
              <Button onClick={handleSubmit} type="submit">
                {current}
              </Button>
              <Button asChild={true} variant={"outline"}>
                <Link href={`/${path}`}>{alt}</Link>
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


