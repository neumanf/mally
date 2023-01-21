import { useQuery } from "@tanstack/react-query";
import { requestApi } from "@/api/request";
import { GetShortUrlsResponse } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

type UseGetShortUrlsQueryProps = {
  accessToken: string;
};

export const useGetShortUrlQuery = ({
  accessToken,
}: UseGetShortUrlsQueryProps) => {
  return useQuery({
    queryKey: ["getPastes", accessToken],
    queryFn: () =>
      requestApi<GetShortUrlsResponse>(
        ENDPOINTS.urlShortener,
        undefined,
        undefined,
        accessToken
      ),
  });
};
