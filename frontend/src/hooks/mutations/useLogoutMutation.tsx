import { useMutation } from "@tanstack/react-query";

import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () =>
      requestApi<{}>(ENDPOINTS.logout, "POST", JSON.stringify({})),
  });
};
