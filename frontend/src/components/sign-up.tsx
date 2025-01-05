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
import { useRouter } from "next/navigation";

interface LoginInput {
  email: string;
  password: string;
  username: string,
  firstName: string,
  lastName: string
}

interface AuthProps {
  endpoint: string;
  current: string;
  alt: string;
  path: string;
}

export function RegistrationForm({ endpoint, current, alt, path }: AuthProps): JSX.Element {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Array<{ message: string, rule: string, field: string }>>([]);
  const { setUser } = useUser();
  const router = useRouter();


  const mutation = useMutation<User, Error, LoginInput>({
    mutationFn: async (credentials: {
      email: string,
      password: string,
      username: string,
      firstName: string,
      lastName: string
    }) => {
      return await fetchData(endpoint, "POST",
        { body: JSON.stringify(credentials) }
      );
    },
    onSuccess: (data: User) => {
      setUser(data);
      alert("An account was created successfully, You may now log in");
      router.push("/login");
    },
    onError: (error: any) => {
      if (error.validationError) {
        setErrors(error.validationError);
        console.log("Validation error");
        console.log(error.validationError);
      } else {
        alert(error.message || "Something went wrong");
        console.log("Error");
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email: email, password: password, username: username, firstName: firstName, lastName: lastName });
  };

  const getErrorMessage = (field: string) => {
    const error = errors.find((err) => err.field === field);
    return error ? error.message : null;
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
              <div className="flex flex-row space-x-1 justify-between items-center">
                <div className="flex flex-col space-y-1.5 m-4 w-full">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id={"firstName"}
                    name={"firstName"}
                    value={firstName}
                    type="text"
                    required={true}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  {getErrorMessage("firstName") &&
                    <p className="text-red-600 text-sm">{getErrorMessage("firstName")}</p>}
                </div>
                <div className="flex flex-col space-y-1.5 m-4 w-full">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id={"lastName"}
                    name={"lastName"}
                    value={lastName}
                    type="text"
                    required={true}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  {getErrorMessage("lastName") && <p className="text-red-600 text-sm">{getErrorMessage("lastName")}</p>}
                </div>
              </div>
              <div className="flex flex-col space-y-1.5 m-4">
                <Label htmlFor="username">Username</Label>
                <Input
                  id={"username"}
                  name={"username"}
                  value={username}
                  type="text"
                  required={true}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {getErrorMessage("username") && <p className="text-red-600 text-sm">{getErrorMessage("username")}</p>}
              </div>
              <div className="flex flex-col space-y-1.5 m-4">
                <Label htmlFor="login">E-mail</Label>
                <Input
                  id={"login"}
                  name={"login"}
                  value={email}
                  type="text"
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {getErrorMessage("email") && <p className="text-red-600 text-sm">{getErrorMessage("email")}</p>}
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
                {getErrorMessage("password") && <p className="text-red-600 text-sm">{getErrorMessage("password")}</p>}
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


