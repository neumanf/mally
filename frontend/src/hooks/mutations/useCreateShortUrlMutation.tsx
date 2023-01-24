import { useMutation } from "@tanstack/react-query";

import {
  CreateShortUrlRequest,
  CreateShortUrlResponse,
} from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

export const useCreateShortUrlMutation = () => {
  return useMutation({
    mutationFn: (body: CreateShortUrlRequest) =>
      requestApi<CreateShortUrlResponse>(
        ENDPOINTS.urlShortener,
        "POST",
        JSON.stringify({ url: body.url })
      ),
  });
};
