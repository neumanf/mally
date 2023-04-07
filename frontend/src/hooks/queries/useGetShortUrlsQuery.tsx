import { useQuery } from "@tanstack/react-query";

import { requestApi } from "@/api/request";
import { GetShortUrlsResponse } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

type UseGetShortUrlsQueryProps = {
  page?: string | string[];
};

export const useGetShortUrlQuery = ({ page }: UseGetShortUrlsQueryProps) => {
  return useQuery({
    queryKey: ["getShortUrls", page],
    queryFn: () => {
      const pageQuery = page ? "?page=" + page : "";
      return requestApi<GetShortUrlsResponse>(
        ENDPOINTS.urlShortener + pageQuery
      );
    },
  });
};
