import { NEXT_PUBLIC_API_URL } from "@/config/api";

export async function fetchData<T>(
  endpoint: string,
  apiURL?: { method: string; body: string },
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem("token");
  const url = apiURL || NEXT_PUBLIC_API_URL;
  const response = await fetch(`${url}/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options?.headers ?? {})
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}


export async function editData(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE" = "POST",
  options?: RequestInit,
  apiURL?: string
) {
  const url = apiURL || NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("token");
  console.log(`${url}/${endpoint}`);
  console.log(`K`);
  const response = await fetch(`${url}/${endpoint}`, {
    method: method,
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options?.headers ?? {})
    }
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