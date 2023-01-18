import { useMutation } from "@tanstack/react-query";

import { SignUpRequest, SignUpResponse } from "@/interfaces/api";
import { requestApi } from "@/api/request";
import { ENDPOINTS } from "@/api/endpoints";

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: (body: SignUpRequest) =>
      requestApi<SignUpResponse>(
        ENDPOINTS.signUp,
        "POST",
        JSON.stringify({
          name: body.name,
          email: body.email,
          password: body.password,
        })
      ),
  });
};
