"use client"
import { useQuery } from "@tanstack/react-query"
import { getResources ,getResourceById, getTags} from "@/services/resource.service"


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
