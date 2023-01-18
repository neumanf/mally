import { useMutation } from "@tanstack/react-query";

import { ShortUrlRequest, ShortUrlResponse } from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

type UseCreateShortUrlMutation = {
  accessToken: string;
};

export const useCreateShortUrlMutation = ({
  accessToken,
}: UseCreateShortUrlMutation) => {
  return useMutation({
    mutationFn: (body: ShortUrlRequest) =>
      requestApi<ShortUrlResponse>(
        ENDPOINTS.urlShortener,
        "POST",
        JSON.stringify({ url: body.url }),
        accessToken
      ),
  });
};
