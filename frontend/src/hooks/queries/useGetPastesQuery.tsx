import { useQuery } from "@tanstack/react-query";
import { requestApi } from "@/api/request";
import { GetPastesResponse } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

type UseGetProfileQueryProps = {
  accessToken: string;
};

export const useGetPastesQuery = ({ accessToken }: UseGetProfileQueryProps) => {
  return useQuery({
    queryKey: ["getPastes", accessToken],
    queryFn: () =>
      requestApi<GetPastesResponse>(
        ENDPOINTS.pastebin,
        undefined,
        undefined,
        accessToken
      ),
  });
};
