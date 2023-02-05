import { useQuery } from "@tanstack/react-query";

import { requestApi } from "@/api/request";
import { GetPastesResponse } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

type UseGetPastesQueryProps = {
  page?: string | string[];
};

export const useGetPastesQuery = ({ page }: UseGetPastesQueryProps) => {
  return useQuery({
    queryKey: ["getPastes", page],
    queryFn: () => {
      const pageQuery = page ? "?page=" + page : "";
      return requestApi<GetPastesResponse>(ENDPOINTS.pastebin + pageQuery);
    },
  });
};
