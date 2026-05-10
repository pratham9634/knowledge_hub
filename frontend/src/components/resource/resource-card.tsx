"use client"

import {
  FileText,
  ImageIcon,
  Video,
  Link2,
  File,
  ArrowUpRight
} from "lucide-react"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import DeleteResourceButton from "@/components/resource/delete-resource-button"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Resource } from "@/types/resource"
import { cn } from "@/lib/utils"

type Props = {
  resource: Resource
}

const typeConfig = {
  link: {
    icon: Link2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    accent: "bg-blue-500",
    label: "Link",
  },
  image: {
    icon: ImageIcon,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    accent: "bg-emerald-500",
    label: "Image",
  },
  video: {
    icon: Video,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    accent: "bg-rose-500",
    label: "Video",
  },
  article: {
    icon: FileText,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    accent: "bg-amber-500",
    label: "Article",
  },
  file: {
    icon: File,
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    accent: "bg-slate-500",
    label: "File",
  },
}

export default function ResourceCard({ resource }: Props) {

  const config = typeConfig[resource.type] || typeConfig.file
  const Icon = config.icon

  return (

    <div className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/60 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5">

      {/* ── Type Accent Bar ── */}
      <div className={cn("absolute top-0 left-0 w-full h-[2px]", config.accent, "opacity-40 group-hover:opacity-70 transition-opacity")} />

      {/* ── Hover Glow ── */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/2 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative p-5 space-y-4">

        {/* ── TOP ── */}
        <div className="flex items-start justify-between gap-3">

          <div className="flex items-start gap-3 min-w-0">

            {/* Icon */}
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300",
              config.bg, config.border, config.color,
              "group-hover:scale-105"
            )}>
              <Icon className="h-4.5 w-4.5" />
            </div>

            {/* Title + Desc */}
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold leading-tight line-clamp-1 text-foreground/90 group-hover:text-foreground transition-colors">
                {resource.title}
              </h2>
              {resource.description && (
                <p className="mt-1.5 text-[13px] text-muted-foreground/60 line-clamp-2 leading-relaxed">
                  {resource.description}
                </p>
              )}
            </div>

          </div>

          {/* Type Badge */}
          <Badge
            variant="secondary"
            className={cn(
              "shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border",
              config.bg, config.border, config.color
            )}
          >
            {config.label}
          </Badge>

        </div>


        {/* ── TAGS ── */}
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-muted/40 border border-border/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground/70 transition-colors hover:text-foreground hover:bg-muted/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}


        {/* ── FOOTER ── */}
        <div className="flex items-center justify-between pt-3 border-t border-border/20">

          <p className="text-[11px] text-muted-foreground/40 font-medium">
            {formatDistanceToNow(
              new Date(resource.created_at),
              { addSuffix: true }
            )}
          </p>

          <div className="flex items-center gap-2">

            <Link href={`/resource/${resource._id}`}>
              <Button
                size="sm"
                className="gap-1.5 rounded-lg text-[12px] h-8 px-3 font-semibold transition-all duration-200 hover:shadow-md hover:shadow-primary/15 cursor-pointer"
                style={{ background: 'var(--accent-gradient)' }}
              >
                Open
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <DeleteResourceButton resourceId={resource._id} />

          </div>

        </div>

      </div>

    </div>
  )
}