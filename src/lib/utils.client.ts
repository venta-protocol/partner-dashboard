import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export enum HttpMethod {
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  GET = "GET",
}

export enum Endpoint {
  PARTNER = "/partner",
  API_KEY = "/api-key",
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sendBackendRequest = async (
  endpoint: string,
  method: HttpMethod,
  data?: any,
  isFormData: boolean = false,
  headerAuthorization: string = ""
): Promise<Response> => {
  const headers: HeadersInit = {};
  let body: string | FormData | undefined;

  if (isFormData) {
    body = data as FormData;
  } else {
    headers["Content-Type"] = "application/json";
    if (headerAuthorization) {
      headers["Authorization"] = headerAuthorization;
    }
    body = data ? JSON.stringify(data) : undefined;
  }

  const response = await fetch(`/api/${endpoint}`, {
    method,
    headers,
    body,
  });
  return response;
};
