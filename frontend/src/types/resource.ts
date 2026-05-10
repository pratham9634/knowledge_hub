export type ResourceType = "link" | "file" | "video" | "image" | "article";

export interface Resource {

  _id: string

  title: string

  type: ResourceType

  description?: string

  tags: string[]

  url?: string

  file_url?: string

  file_path?: string

  content?: string

  created_at: string

  updated_at: string
}

export interface PaginatedResources {

  data: Resource[]

  page: number

  limit: number

  total: number
}