import { useQuery } from "@tanstack/react-query";
import { requestApi } from "@/api/request";
import { CreatePastebinResponse } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

type UseGetPasteQueryProps = {
  slug?: string | string[];
};

export const useGetPasteQuery = ({ slug }: UseGetPasteQueryProps) => {
  return useQuery({
    queryKey: ["paste", slug],
    queryFn: () => {
      return requestApi<CreatePastebinResponse>(
        ENDPOINTS.pastebin + `/${slug}`
      );
    },
    enabled: !!slug,
  });
};
