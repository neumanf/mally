import { useQuery } from "@tanstack/react-query";
import { requestApi } from "@/api/request";
import { GetPastesResponse } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

export const useGetPastesQuery = () => {
  return useQuery({
    queryKey: ["getPastes"],
    queryFn: () => requestApi<GetPastesResponse>(ENDPOINTS.pastebin),
  });
};
