"use client"
import { useQuery } from "@tanstack/react-query"
import { getResources ,getResourceById, getTags} from "@/services/resource.service"

// This hook is used to fetch a list of resources based on the provided filters and pagination options. It will refetch the data whenever any of the parameters change.
export function useResources(
  search?: string,
  type?: string,
  tag?: string,
  page?: number,
  limit?: number
) {

  return useQuery({
    queryKey: ["resources",search,type,tag,page,limit],
    queryFn: () => getResources(search,type,tag,page,limit),
    staleTime: 1000 * 60 * 5
  })
}

// This hook is used to fetch a single resource by its ID. It will only run if an ID is provided.
export function useResource(
  id: string
) {

  return useQuery({

    queryKey: [
      "resource",
      id
    ],

    queryFn: () =>
      getResourceById(id),

    enabled: !!id
  })
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => getTags(),
    staleTime: 1000 * 60 * 5
  })
}
