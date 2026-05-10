"use client"

import { useMutation,
         useQueryClient }
from "@tanstack/react-query"

import {
  deleteResource
} from "@/services/resource.service"

import { toast }
from "sonner"


export function useDeleteResource() {

  const queryClient =
    useQueryClient()


  return useMutation({

    mutationFn: deleteResource,

    onSuccess: () => {

      toast.success(
        "Resource deleted"
      )

      queryClient.invalidateQueries({
        queryKey: ["resources"]
      })
    },

    onError: (error: any) => {

      toast.error(Array.isArray(error?.response?.data?.detail) ? error.response.data.detail[0].msg : error?.response?.data?.detail || "Delete failed")
    }
  })
}
