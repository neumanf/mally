import { useMutation } from "@tanstack/react-query";

import {
  CreatePastebinRequest,
  CreatePastebinResponse,
} from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

type UseCreatePasteMutationProps = {
  accessToken: string;
};

export const useCreatePasteMutation = ({
  accessToken,
}: UseCreatePasteMutationProps) => {
  return useMutation({
    mutationFn: (body: CreatePastebinRequest) =>
      requestApi<CreatePastebinResponse>(
        ENDPOINTS.pastebin,
        "POST",
        JSON.stringify({ content: body.content, syntax: body.syntax }),
        accessToken
      ),
  });
};
