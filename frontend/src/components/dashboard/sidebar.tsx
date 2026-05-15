"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  LogOut,
  Tag,
  Search,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { logoutUser } from "@/services/auth.service"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { toast } from "sonner"
import { useTags, useResources } from "@/hooks/use-resource"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/use-user-store"


const LIMIT_OPTIONS = [5, 10, 20, 50]

export default function Sidebar() {

  const clearUser = useUserStore((s) => s.clearUser)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeTag = searchParams.get("tag")
  const currentSearch = searchParams.get("search") || ""
  const currentPage = Number(searchParams.get("page")) || 1
  const currentLimit = Number(searchParams.get("limit")) || 10

  const [searchValue, setSearchValue] = useState(currentSearch)
  const { data: tags } = useTags()

  // We read total from the resources response to compute page count
  const { data: resourceData } = useResources(
    currentSearch || undefined,
    undefined,
    activeTag || undefined,
    currentPage,
    currentLimit
  )
  const total = resourceData?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / currentLimit))

  // Push search param to URL with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (searchValue) {
        params.set("search", searchValue)
      } else {
        params.delete("search")
      }
      // Reset to page 1 when searching
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchValue])

  const clearSearch = () => setSearchValue("")

  const pushParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return
    pushParam("page", page === 1 ? null : String(page))
  }

  const setLimit = (limit: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("limit", String(limit))
    params.delete("page") // reset to page 1
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      clearUser()
      toast.success("Logged out successfully")
      router.push("/login")
    } catch {
      toast.error("Logout failed")
    }
  }

  const isHome = !activeTag && !currentSearch

  return (
    <aside className="h-screen w-[280px] min-w-[280px] border-r border-border/40 bg-sidebar/80 backdrop-blur-xl flex flex-col">

      {/* ── Brand + Logout ── */}
      <div className="px-5 pt-6 pb-5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/20 transition-all duration-300 group-hover:shadow-md group-hover:shadow-primary/15 group-hover:scale-105">
            <BookOpen className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <span className="text-[15px] font-bold tracking-tight gradient-text">Knowledge Hub</span>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          title="Log out"
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer bg-blue-500 "
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* ── Search ── */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search resources…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="
              h-9 w-full rounded-xl border border-border/50
              bg-muted/30 pl-9 pr-8 text-[13px]
              text-foreground placeholder:text-muted-foreground/40
              outline-none transition-all duration-200
              focus:border-primary/40 focus:bg-muted/50 focus:shadow-sm focus:shadow-primary/5
            "
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">

        {/* Main */}
        <div className="space-y-1">
          <Link href="/dashboard">
            <div
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 cursor-pointer relative",
                isHome
                  ? "bg-primary/10 text-primary border border-primary/15"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {isHome && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
              )}
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              All Resources
              {total > 0 && (
                <span className={cn(
                  "ml-auto text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md",
                  isHome ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {total}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/40 mb-2">
              Tags
            </p>
            <div className="space-y-0.5">
              {tags.map((tag, index) => {
                const colors = [
                  'bg-blue-500',
                  'bg-emerald-500',
                  'bg-violet-500',
                  'bg-amber-500',
                  'bg-rose-500',
                  'bg-cyan-500',
                  'bg-orange-500',
                  'bg-pink-500',
                ]
                const dotColor = colors[index % colors.length]

                return (
                  <Link key={tag} href={`/dashboard?tag=${tag}`}>
                    <div
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-all duration-200 cursor-pointer relative",
                        activeTag === tag
                          ? "bg-primary/10 text-primary font-medium border border-primary/15"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {activeTag === tag && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary" />
                      )}
                      <div className={cn("h-2 w-2 rounded-full shrink-0", dotColor)} />
                      <span className="truncate">{tag}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* ── Pagination ── */}
      <div className="border-t border-border/30 px-4 py-3 space-y-3">

        {/* Per-page selector */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/40">
            Per page
          </span>
          <div className="flex gap-1">
            {LIMIT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setLimit(opt)}
                className={cn(
                  "h-7 min-w-[30px] rounded-lg px-1.5 text-[12px] font-medium transition-all duration-200",
                  currentLimit === opt
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Page navigation */}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-muted-foreground/60">
            Page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
                currentPage <= 1
                  ? "text-muted-foreground/20 cursor-not-allowed"
                  : "text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
                currentPage >= totalPages
                  ? "text-muted-foreground/20 cursor-not-allowed"
                  : "text-muted-foreground/60 hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>



    </aside>
  )
}