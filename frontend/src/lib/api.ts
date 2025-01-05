import { NEXT_PUBLIC_API_URL } from "@/config/api";


export async function fetchData(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" | "GET" = "POST",
  options?: RequestInit,
  apiURL?: string
) {
  const url = apiURL || NEXT_PUBLIC_API_URL;
  const response = await fetch(`${url}/${endpoint}`, {
    method: method,
    ...options,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  });
  const contentType = response.headers.get("Content-Type") || "";

  if (!response.ok) {

    if (response.status === 400) {
      let errorData: any;

      if (contentType.includes("application/json")) {
        errorData = await response.json();
      }
      else {
        const textError = await response.text();
        errorData = { message: textError };
        console.log(errorData);
      }
      throw { validationError: errorData };
    }
    throw new Error(response.statusText);

  }

  if (contentType.includes("application/json")) {
    return await response.json();

  } else if (response.statusText === "204") return null;

  else if (contentType.includes("text/")) {
    return await response.text();

  } else return response.blob();

}