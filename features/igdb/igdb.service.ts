import { api } from "@/lib/api/apiClient";
import { endPoints } from "@/lib/api/endPoint";

// API call for searching functionality in igdb
export type IgdbSearchItem = {
  igdbId: number;
  name: string;
  imageUrl: string | null;
  description: string;
};

export const searchIgdb = async (query: string) => {
  const { data } = await api.get<IgdbSearchItem[]>(endPoints.igdb.search, {
    params: { q: query },
  });

  return data
};
