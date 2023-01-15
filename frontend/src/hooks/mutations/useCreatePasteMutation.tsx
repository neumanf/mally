import { useMutation } from "@tanstack/react-query";

import { PastebinRequest, PastebinResponse } from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

export const useCreatePasteMutation = () => {
  return useMutation({
    mutationFn: (body: PastebinRequest) =>
      requestApi<PastebinResponse>(
        ENDPOINTS.pastebin,
        "POST",
        JSON.stringify({ content: body.content, syntax: body.syntax })
      ),
  });
};
