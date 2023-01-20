import { ErrorResponse } from "@/interfaces/api";

export class ApiError extends Error {
  readonly statusCode: number;

  constructor(data: ErrorResponse) {
    super(Array.isArray(data.message) ? data.message.join(",") : data.message);
    this.statusCode = data.statusCode;
    this.name = data.error;
  }
}

export async function requestApi<TResponse>(
  path: string,
  method = "GET",
  body?: any,
  token?: string
): Promise<TResponse> {
  return fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/proxy${path}`, {
    method,
    body,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + token,
    },
    credentials: "include",
  }).then((response) =>
    response.json().then((data) => {
      if (!response.ok) {
        throw new ApiError(data);
      }
      return data as TResponse;
    })
  );
}
