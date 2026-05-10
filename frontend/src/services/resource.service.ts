import api from "@/lib/axios"
import { PaginatedResources, Resource } from "@/types/resource"
export const getResources =
  async (
    search?: string,
    type?: string,
    tag?: string,
    page?: number,
    limit?: number
  ) => {
    const response = await api.get<{ message: string, resources: PaginatedResources }>("/resources", { params: { search, type, tag, page, limit } })
    return response.data.resources
  }

export const deleteResource =
  async (id: string) => {

    const response =
      await api.delete(
        `/resources/${id}`
      )

    return response.data
}


export const createResource =
  async (data: any) => {

    const response =
      await api.post(
        "/resources",
        data
      )

    return response.data
}

export const getResourceById =
  async (id: string) => {

    const response =
      await api.get<{ message: string, data: Resource }>(
        `/resources/${id}`
      )

    return response.data.data
}

export const updateResource =
  async (
    id: string,
    data: any
  ) => {

    const response =
      await api.put(
        `/resources/${id}`,
        data
      )

    return response.data
}

export const getTags = async () => {
  const response = await api.get<{ message: string, data: string[] }>("/resources/tags")
  return response.data.data
}