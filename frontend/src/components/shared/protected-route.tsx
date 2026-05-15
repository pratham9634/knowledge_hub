"use client"

import { useEffect } from "react"

import { useRouter }
from "next/navigation"

import { BookOpen }
from "lucide-react"

import { useCurrentUser }
from "@/hooks/use-current-user"

import { useUserStore }
from "@/store/use-user-store"


export default function ProtectedRoute({
  children
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const setUser = useUserStore((s) => s.setUser)
  const clearUser = useUserStore((s) => s.clearUser)

  const {
    data,
    isLoading,
    isError
  } = useCurrentUser()

  // Hydrate the Zustand store once the user data arrives
  useEffect(() => {
    if (data) {
      setUser(data)
    }
  }, [data, setUser])

  // Clear user and redirect on auth error
  useEffect(() => {
    if (isError) {
      clearUser()
      router.push("/login")
    }
  }, [isError, router, clearUser])


  if (isLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">

        {/* Ambient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full bg-primary/4 blur-[100px]" />
        </div>

        {/* Branded Loader */}
        <div className="relative flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 animate-pulse-glow">
            <BookOpen className="h-7 w-7 text-primary/60" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold gradient-text">Knowledge Hub</span>
            <span className="text-[12px] text-muted-foreground/40">Loading your workspace...</span>
          </div>
        </div>

      </div>
    )
  }


  if (!data) return null


  return children
}