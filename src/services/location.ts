import { api } from "./api";

export type City = {
  name: string;
};

export type CitiesResponse = {
  cities: City[];
  total: number;
  offset: number;
  limit: number;
};

type GetIndianCitiesParams = {
  search?: string;
  limit?: number;
  offset?: number;
};

export async function getIndianCities({
  search,
  limit = 10,
  offset = 0,
}: GetIndianCitiesParams = {}): Promise<CitiesResponse> {
  const response = await api.get<CitiesResponse>("/locations/india/cities", {
    params: {
      ...(search ? { search } : {}),
      limit,
      offset,
    },
  });

  return response.data;
}
