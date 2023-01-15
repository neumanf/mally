export async function requestApi<TResponse>(
  path: string,
  method = "GET",
  body?: any
): Promise<TResponse> {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    method,
    body,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data as TResponse);
}
