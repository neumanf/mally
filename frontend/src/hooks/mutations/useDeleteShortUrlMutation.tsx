import { useMutation } from "@tanstack/react-query";

import { DeleteShortUrlRequest } from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

export const useDeleteShortUrlMutation = () => {
  return useMutation({
    mutationFn: ({ id }: DeleteShortUrlRequest) =>
      requestApi<{}>(ENDPOINTS.urlShortener + `/${id}`, "DELETE"),
  });
};
