import { useMutation } from "@tanstack/react-query";

import {
  CreatePastebinRequest,
  CreatePastebinResponse,
} from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

export const useCreatePasteMutation = () => {
  return useMutation({
    mutationFn: (body: CreatePastebinRequest) =>
      requestApi<CreatePastebinResponse>(
        ENDPOINTS.pastebin,
        "POST",
        JSON.stringify(body)
      ),
  });
};
