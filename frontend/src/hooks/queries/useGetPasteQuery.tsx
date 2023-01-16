import { useQuery } from "@tanstack/react-query";
import { requestApi } from "@/api/request";
import { PastebinResponse } from "@/interfaces/api";
import { ENDPOINTS } from "@/api/endpoints";

type UseGetPasteQueryProps = {
  slug: string;
};

export const useGetPasteQuery = ({ slug }: UseGetPasteQueryProps) => {
  return useQuery({
    queryKey: ["paste", slug],
    queryFn: () =>
      requestApi<PastebinResponse>(ENDPOINTS.pastebin + `?slug=${slug}`),
  });
};
