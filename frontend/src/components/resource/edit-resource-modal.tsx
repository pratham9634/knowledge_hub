"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { Pencil, Loader2, Link2, FileText, ImageIcon, Video, File, Upload } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Resource } from "@/types/resource"
import { useUpdateResource } from "@/hooks/use-update-resource"

import {
  uploadImage,
  uploadFile,
  uploadVideo,
} from "@/services/upload.service"


type Props = {
  resource: Resource
}

type ResourceType =
  | "link"
  | "file"
  | "image"
  | "article"
  | "video"


export default function EditResourceModal({ resource }: Props) {

  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(resource.title)
  const [type, setType] = useState<ResourceType>(resource.type)
  const [description, setDescription] = useState(resource.description || "")
  const [tags, setTags] = useState(resource.tags.join(", "))
  const [url, setUrl] = useState(resource.url || "")
  const [content, setContent] = useState(resource.content || "")
  const [file, setFile] = useState<File | null>(null)

  const { mutate, isPending } = useUpdateResource()

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        toast.error("Title is required")
        return
      }

      const payload: any = {
        title,
        type,
        description,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      }

      if (type === "link") {
        if (!url.trim()) {
          toast.error("URL is required")
          return
        }
        payload.url = url
      }

      if (type === "article") {
        if (!content.trim()) {
          toast.error("Article content required")
          return
        }
        payload.content = content
      }

      if (["file", "image", "video"].includes(type)) {
        payload.file_url = resource.file_url
        payload.file_path = resource.file_path

        if (file) {
          let uploadResult

          if (type === "image") {
            uploadResult = await uploadImage(file)
          }
          if (type === "video") {
            uploadResult = await uploadVideo(file)
          }
          if (type === "file") {
            uploadResult = await uploadFile(file)
          }

          payload.file_url = uploadResult.file_url
          payload.file_path = uploadResult.file_path
        }
      }

      mutate(
        { id: resource._id, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resources"] })
            queryClient.invalidateQueries({ queryKey: ["resource", resource._id] })
            setOpen(false)
          },
        }
      )

    } catch (error: any) {
      const errDetail = error?.response?.data?.detail
      const errorMessage = Array.isArray(errDetail) ? errDetail[0].msg : errDetail
      toast.error(errorMessage || "Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      {/* TRIGGER */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 rounded-xl border-border/40 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] rounded-2xl border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30 flex flex-col">

        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold">
            Edit Resource
          </DialogTitle>
          <p className="text-sm text-muted-foreground/60">
            Update your resource details
          </p>
        </DialogHeader>

        <div className="space-y-5 py-2 overflow-y-auto flex-1 pr-1">

          {/* TITLE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter resource title"
              className="h-10 bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all"
            />
          </div>

          {/* TYPE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Resource Type</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as ResourceType)}
            >
              <SelectTrigger className="h-10 bg-muted/20 border-border/40 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/30 bg-popover/95 backdrop-blur-xl">
                <SelectItem value="link">
                  <span className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5 text-blue-400" /> Link</span>
                </SelectItem>
                <SelectItem value="file">
                  <span className="flex items-center gap-2"><File className="h-3.5 w-3.5 text-slate-400" /> File</span>
                </SelectItem>
                <SelectItem value="image">
                  <span className="flex items-center gap-2"><ImageIcon className="h-3.5 w-3.5 text-emerald-400" /> Image</span>
                </SelectItem>
                <SelectItem value="article">
                  <span className="flex items-center gap-2"><FileText className="h-3.5 w-3.5 text-amber-400" /> Article</span>
                </SelectItem>
                <SelectItem value="video">
                  <span className="flex items-center gap-2"><Video className="h-3.5 w-3.5 text-rose-400" /> Video</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* LINK */}
          {type === "link" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-10 bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all"
              />
            </div>
          )}

          {/* ARTICLE */}
          {type === "article" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Article Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write article..."
                className="min-h-[200px] bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all resize-none"
              />
            </div>
          )}

          {/* FILE INPUT */}
          {["file", "image", "video"].includes(type) && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Replace File (optional)</Label>
              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed border-border/40 bg-muted/10 hover:bg-muted/20 hover:border-primary/30 transition-all cursor-pointer">
                  <Upload className="h-5 w-5 text-muted-foreground/40 mb-1.5" />
                  <span className="text-[13px] text-muted-foreground/60">
                    {file ? file.name : "Click to select a new file"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
              {resource.file_url && (
                <a
                  href={resource.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-primary/70 hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  View current file →
                </a>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-border/20" />

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="min-h-[80px] bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all resize-none"
            />
          </div>

          {/* TAGS */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Tags</Label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="react, backend, ai"
              className="h-10 bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all"
            />
            <p className="text-[11px] text-muted-foreground/40">
              Separate tags with commas
            </p>
          </div>

          {/* SUBMIT */}
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-11 rounded-xl text-[14px] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
            style={{ background: isPending ? undefined : 'var(--accent-gradient)' }}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating Resource...
              </div>
            ) : (
              "Update Resource"
            )}
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  )
}