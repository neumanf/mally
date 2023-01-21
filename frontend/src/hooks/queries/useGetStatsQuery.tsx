import { useQuery } from "@tanstack/react-query";
import { requestApi } from "@/api/request";
import { GetStatsResponse } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

export const useGetStatsQuery = () => {
  return useQuery({
    queryKey: ["getStats"],
    queryFn: () => requestApi<GetStatsResponse>(ENDPOINTS.stats),
  });
};
