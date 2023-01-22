import { useQuery } from "@tanstack/react-query";
import { requestApi } from "@/api/request";
import { GetShortUrlsResponse } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

export const useGetShortUrlQuery = () => {
  return useQuery({
    queryKey: ["getPastes"],
    queryFn: () => requestApi<GetShortUrlsResponse>(ENDPOINTS.urlShortener),
  });
};
