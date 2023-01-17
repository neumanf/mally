import { useMutation } from "@tanstack/react-query";

import { LoginRequest, LoginResponse } from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (body: LoginRequest) =>
      requestApi<LoginResponse>(
        ENDPOINTS.login,
        "POST",
        JSON.stringify({ username: body.username, password: body.password })
      ),
  });
};
