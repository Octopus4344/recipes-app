"use client";

import { JSX, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { editData } from "@/lib/api";

interface AuthResponse {
  token: string;
  role: "amateur" | "restaurant" | "cook" | "foodProducer";
}

interface LoginInput {
  username: string;
  password: string;
}

interface AuthProps {
  endpoint: string;
  current: string;
  alt: string;
  path: string;
}

export function AuthForm({ endpoint, current, alt, path }: AuthProps): JSX.Element {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();


  const mutation = useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: async (credentials: { username: string, password: string }) => {
      return await editData(endpoint, {
        method: "POST",
        body: JSON.stringify(credentials)
      });
    },
    onSuccess: (data: AuthResponse) => {
      login(data.token, { role: data.role });
    },
    onError: (error: Error) => {
      alert(error.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username: username, password: password });
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
                  value={username}
                  type="text"
                  required={true}
                  onChange={(e) => setUsername(e.target.value)}
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


