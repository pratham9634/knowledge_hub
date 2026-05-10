"use client"

import { useQuery } from "@tanstack/react-query"

import { getCurrentUser }
from "@/services/auth.service"


export function useCurrentUser() {

  return useQuery({

    queryKey: ["current-user"],

    queryFn: getCurrentUser,

    retry: false
  })
}