import { useMutation } from "@tanstack/react-query";

import { DeletePastebinRequest } from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

export const useDeletePasteMutation = () => {
  return useMutation({
    mutationFn: ({ id }: DeletePastebinRequest) =>
      requestApi<{}>(ENDPOINTS.pastebin + `/${id}`, "DELETE"),
  });
};
