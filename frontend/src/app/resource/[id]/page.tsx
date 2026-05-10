"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useResource } from "@/hooks/use-resource"
import DeleteResourceButton from "@/components/resource/delete-resource-button"
import EditResourceModal from "@/components/resource/edit-resource-modal"
import {
  Loader2,
  ArrowLeft,
  ExternalLink,
  Link2,
  FileText,
  ImageIcon,
  Video,
  File,
  Calendar,
  BookOpen,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const typeConfig = {
  link: { icon: Link2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Link" },
  image: { icon: ImageIcon, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Image" },
  video: { icon: Video, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "Video" },
  article: { icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Article" },
  file: { icon: File, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", label: "File" },
}

export default function ResourceViewerPage() {

  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  const {
    data: resource,
    isLoading,
    isError,
  } = useResource(id)


  // ── Loading State ──
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/15 animate-pulse-glow">
            <BookOpen className="h-7 w-7 text-primary/60" />
          </div>
          <p className="text-sm text-muted-foreground/50">Loading resource...</p>
        </div>
      </div>
    )
  }


  // ── Error State ──
  if (isError || !resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/15">
          <File className="h-8 w-8 text-destructive/60" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Resource not found</h1>
          <p className="text-muted-foreground/60 mt-2">This resource may have been deleted</p>
        </div>
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="rounded-xl border-border/40 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  const config = typeConfig[resource.type] || typeConfig.file
  const Icon = config.icon

  return (

    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 animate-fade-in">

      {/* ── BACK BUTTON ── */}
      <Link href="/dashboard">
        <Button
          variant="ghost"
          className="gap-2 rounded-xl text-muted-foreground/60 hover:text-foreground hover:bg-muted/30 transition-all -ml-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>


      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

        <div className="space-y-4 flex-1">

          {/* Type + Date */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              className={cn(
                "rounded-lg px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border",
                config.bg, config.border, config.color
              )}
            >
              <Icon className="h-3 w-3 mr-1.5" />
              {config.label}
            </Badge>
            <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground/50">
              <Calendar className="h-3.5 w-3.5" />
              {formatDistanceToNow(
                new Date(resource.created_at),
                { addSuffix: true }
              )}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-foreground/95">
            {resource.title}
          </h1>

          {/* Description */}
          {resource.description && (
            <p className="text-[16px] text-muted-foreground/60 max-w-3xl leading-relaxed">
              {resource.description}
            </p>
          )}

          {/* Tags */}
          {resource.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-lg bg-muted/30 border border-border/30 px-2.5 py-1 text-[12px] font-medium text-muted-foreground/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <EditResourceModal resource={resource} />
          <DeleteResourceButton
            resourceId={resource._id}
            onDeleted={() => router.push("/dashboard")}
          />
        </div>

      </div>


      {/* ── CONTENT CARD ── */}
      <div className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm overflow-hidden">

        <div className="p-6 lg:p-8">

          {/* LINK */}
          {resource.type === "link" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl border border-border/30 bg-muted/10 break-all text-[14px] text-foreground/70 font-mono">
                {resource.url}
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="gap-2 rounded-xl cursor-pointer"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Link
                </Button>
              </a>
            </div>
          )}


          {/* ARTICLE */}
          {resource.type === "article" && (
            <article className="prose prose-invert max-w-none prose-headings:text-foreground/90 prose-p:text-muted-foreground/70 prose-a:text-primary">
              <div className="whitespace-pre-wrap leading-8 text-[15px] text-foreground/80">
                {resource.content}
              </div>
            </article>
          )}


          {/* IMAGE */}
          {resource.type === "image" && (
            <div className="flex justify-center">
              <img
                src={resource.file_url}
                alt={resource.title}
                className="w-full max-h-[700px] object-contain rounded-xl border border-border/20"
              />
            </div>
          )}


          {/* VIDEO */}
          {resource.type === "video" && (
            <div className="rounded-xl overflow-hidden border border-border/20">
              <video
                controls
                className="w-full"
              >
                <source src={resource.file_url} />
              </video>
            </div>
          )}


          {/* FILE */}
          {resource.type === "file" && (
            <div className="space-y-5">
              <div className="rounded-xl overflow-hidden border border-border/20">
                <iframe
                  src={resource.file_url}
                  className="w-full h-[650px]"
                />
              </div>
              <a
                href={resource.file_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="gap-2 rounded-xl cursor-pointer"
                  style={{ background: 'var(--accent-gradient)' }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open / Download File
                </Button>
              </a>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}