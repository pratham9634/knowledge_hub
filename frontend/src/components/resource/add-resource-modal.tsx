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
import { Plus, Loader2, Link2, FileText, ImageIcon, Video, File, Upload } from "lucide-react"

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

import { toast } from "sonner"

import {
  createResource,
} from "@/services/resource.service"

import {
  uploadImage,
  uploadFile,
  uploadVideo,
} from "@/services/upload.service"


type ResourceType =
  | "link"
  | "file"
  | "image"
  | "article"
  | "video"


export default function AddResourceModal() {

  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [type, setType] = useState<ResourceType>("link")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [url, setUrl] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const resetForm = () => {
    setTitle("")
    setType("link")
    setDescription("")
    setTags("")
    setUrl("")
    setContent("")
    setFile(null)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      toast.success("Resource created successfully")
      queryClient.invalidateQueries({ queryKey: ["resources"] })
      setOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      const errDetail = error?.response?.data?.detail
      const errorMessage = Array.isArray(errDetail) ? errDetail[0].msg : errDetail
      toast.error(errorMessage || "Failed to create resource")
    },
  })

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
          toast.error("Article content is required")
          return
        }
        payload.content = content
      }

      if (["file", "image", "video"].includes(type)) {
        if (!file) {
          toast.error("Please select a file")
          return
        }

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

      mutate(payload)

    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      {/* TRIGGER */}
      <DialogTrigger asChild>
        <Button
          className="gap-2 rounded-xl h-10 px-5 text-[13px] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 cursor-pointer"
          style={{ background: 'var(--accent-gradient)' }}
        >
          <Plus className="h-4 w-4" />
          Add Resource
        </Button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] rounded-2xl border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30 flex flex-col">

        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold">
            Add New Resource
          </DialogTitle>
          <p className="text-sm text-muted-foreground/60">
            Save a resource to your knowledge library
          </p>
        </DialogHeader>

        <div className="space-y-5 py-2 overflow-y-auto flex-1 pr-1">

          {/* TITLE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Title</Label>
            <Input
              placeholder="Enter resource title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          {/* LINK URL */}
          {type === "link" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">URL</Label>
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-10 bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all"
              />
            </div>
          )}

          {/* ARTICLE CONTENT */}
          {type === "article" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Article Content</Label>
              <Textarea
                placeholder="Write your article..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[180px] bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all resize-none"
              />
            </div>
          )}

          {/* FILE INPUT */}
          {["file", "image", "video"].includes(type) && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">
                {type === "image" ? "Upload Image" : type === "video" ? "Upload Video" : "Upload File"}
              </Label>
              <div className="relative">
                <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed border-border/40 bg-muted/10 hover:bg-muted/20 hover:border-primary/30 transition-all cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground/40 mb-2" />
                  <span className="text-[13px] text-muted-foreground/60">
                    {file ? file.name : "Click to select a file"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-border/20" />

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Description</Label>
            <Textarea
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all resize-none"
            />
          </div>

          {/* TAGS */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Tags</Label>
            <Input
              placeholder="react, backend, ai"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="h-10 bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all"
            />
            <p className="text-[11px] text-muted-foreground/40">
              Separate tags with commas
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full h-11 rounded-xl text-[14px] font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
            style={{ background: isPending ? undefined : 'var(--accent-gradient)' }}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Resource...
              </div>
            ) : (
              "Create Resource"
            )}
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  )
}
