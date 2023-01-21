import { useMutation } from "@tanstack/react-query";

import {
  CreateShortUrlRequest,
  CreateShortUrlResponse,
} from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

type UseCreateShortUrlMutation = {
  accessToken: string;
};

export const useCreateShortUrlMutation = ({
  accessToken,
}: UseCreateShortUrlMutation) => {
  return useMutation({
    mutationFn: (body: CreateShortUrlRequest) =>
      requestApi<CreateShortUrlResponse>(
        ENDPOINTS.urlShortener + "/redirect",
        "POST",
        JSON.stringify({ url: body.url }),
        accessToken
      ),
  });
};
