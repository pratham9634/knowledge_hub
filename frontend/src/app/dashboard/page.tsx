"use client"

import { useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

import { useResources } from "@/hooks/use-resource"
import ResourceCard from "@/components/resource/resource-card"
import ResourceCardSkeleton from "@/components/resource/resource-card-skeleton"
import AddResourceModal from "@/components/resource/add-resource-modal"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { Search, SlidersHorizontal, FolderOpen, Plus } from "lucide-react"


export default function DashboardPage() {

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const tagParam = searchParams.get("tag") || undefined
  const searchParam = searchParams.get("search") || ""
  const pageParam = Number(searchParams.get("page")) || 1
  const limitParam = Number(searchParams.get("limit")) || 10

  const [type, setType] = useState("")

  const { data, isLoading } = useResources(searchParam || undefined, type || undefined, tagParam, pageParam, limitParam)


  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">

        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-muted/50 rounded-xl animate-pulse" />
            <div className="h-5 w-64 bg-muted/30 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-muted/50 rounded-xl animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <ResourceCardSkeleton key={index} />
          ))}
        </div>

      </div>
    )
  }


  return (

    <div className="space-y-8 animate-fade-in">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-[15px] text-muted-foreground/70">
            Manage and organize your knowledge resources
          </p>
        </div>

        <AddResourceModal />

      </div>


      {/* ── FILTERS ── */}
      <div className="flex flex-col sm:flex-row gap-3">

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
          <Input
            placeholder="Search resources..."
            value={searchParam}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString())
              if (e.target.value) {
                params.set("search", e.target.value)
              } else {
                params.delete("search")
              }
              router.push(`${pathname}?${params.toString()}`)
            }}
            className="pl-10 h-10 bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 focus:bg-muted/30 transition-all"
          />
        </div>

        <div className="relative">
          <Select value={type} onValueChange={(val) => setType(val === "all" ? "" : val)}>
            <SelectTrigger className="w-[180px] h-10 bg-muted/20 border-border/40 rounded-xl">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-muted-foreground/50" />
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/40 bg-popover/95 backdrop-blur-xl">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="link">Links</SelectItem>
              <SelectItem value="file">Files</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>


      {/* ── EMPTY STATE ── */}
      {data?.data?.length === 0 && (
        <div className="glass rounded-2xl py-20 text-center animate-fade-in">
          <div className="flex justify-center mb-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15">
              <FolderOpen className="h-8 w-8 text-primary/60" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground/90">No resources found</h2>
          <p className="text-muted-foreground/60 mt-2 text-[15px]">
            Start building your knowledge library
          </p>
        </div>
      )}


      {/* ── GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
        {data?.data?.map((resource) => (
          <ResourceCard
            key={resource._id}
            resource={resource}
          />
        ))}
      </div>

    </div>
  )
}