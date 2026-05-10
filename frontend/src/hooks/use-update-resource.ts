"use client"

import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query"

import {
  updateResource
} from "@/services/resource.service"

import { toast }
from "sonner"


export function useUpdateResource() {

  const queryClient =
    useQueryClient()


  return useMutation({

    mutationFn: ({
      id,
      data
    }: {
      id: string
      data: any
    }) =>
      updateResource(
        id,
        data
      ),

    onSuccess: (_, variables) => {

      toast.success(
        "Resource updated"
      )

      queryClient.invalidateQueries({
        queryKey: ["resources"]
      })

      queryClient.invalidateQueries({
        queryKey: [
          "resource",
          variables.id
        ]
      })
    },

    onError: (error: any) => {

      toast.error(Array.isArray(error?.response?.data?.detail) ? error.response.data.detail[0].msg : error?.response?.data?.detail || "Update failed")
    }
  })
}
