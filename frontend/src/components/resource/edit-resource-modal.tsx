"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

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
import { Pencil, Loader2, Link2, FileText, ImageIcon, Video, File as FileIcon, Upload } from "lucide-react"
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

const getFormSchema = (resource: Resource) => z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["link", "file", "image", "article", "video"]),
  description: z.string().optional(),
  tags: z.string().optional(),
  url: z.string().optional(),
  content: z.string().optional(),
  file: z.any().optional()
}).superRefine((data, ctx) => {
  if (data.type === "link" && (!data.url || !data.url.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "URL is required",
      path: ["url"]
    });
  }
  if (data.type === "article" && (!data.content || !data.content.trim())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Article content is required",
      path: ["content"]
    });
  }
  if (["file", "image", "video"].includes(data.type)) {
    if (!data.file && !resource.file_url) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a file",
        path: ["file"]
      });
    }
  }
});


export default function EditResourceModal({ resource }: Props) {

  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)

  const formSchema = getFormSchema(resource)
  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: resource.title || "",
      type: (resource.type as ResourceType) || "link",
      description: resource.description || "",
      tags: resource.tags ? resource.tags.join(", ") : "",
      url: resource.url || "",
      content: resource.content || "",
      file: undefined,
    }
  })

  const { register, control, watch, handleSubmit, setValue, reset, formState: { errors } } = form

  const type = watch("type")
  const file = watch("file")

  useEffect(() => {
    if (open) {
      reset({
        title: resource.title || "",
        type: (resource.type as ResourceType) || "link",
        description: resource.description || "",
        tags: resource.tags ? resource.tags.join(", ") : "",
        url: resource.url || "",
        content: resource.content || "",
        file: undefined,
      })
    }
  }, [open, resource, reset])

  const { mutate, isPending } = useUpdateResource()

  const onSubmit = async (data: FormData) => {
    try {
      const payload: any = {
        title: data.title,
        type: data.type,
        description: data.description,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      }

      if (data.type === "link") {
        payload.url = data.url
      }

      if (data.type === "article") {
        payload.content = data.content
      }

      if (["file", "image", "video"].includes(data.type)) {
        payload.file_url = resource.file_url
        payload.file_path = resource.file_path

        if (data.file) {
          let uploadResult

          if (data.type === "image") {
            uploadResult = await uploadImage(data.file)
          }
          if (data.type === "video") {
            uploadResult = await uploadVideo(data.file)
          }
          if (data.type === "file") {
            uploadResult = await uploadFile(data.file)
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2 overflow-y-auto flex-1 pr-1">

          {/* TITLE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Title</Label>
            <Input
              placeholder="Enter resource title"
              {...register("title")}
              className={`h-10 bg-muted/20 border-border/40 rounded-xl transition-all ${errors.title ? 'border-red-500/50 focus-visible:ring-red-500/50' : 'focus:border-primary/40'}`}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message as string}</p>}
          </div>

          {/* TYPE */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Resource Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (value !== 'file' && value !== 'image' && value !== 'video') {
                      setValue("file", undefined);
                    }
                  }}
                >
                  <SelectTrigger className="h-10 bg-muted/20 border-border/40 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/30 bg-popover/95 backdrop-blur-xl">
                    <SelectItem value="link">
                      <span className="flex items-center gap-2"><Link2 className="h-3.5 w-3.5 text-blue-400" /> Link</span>
                    </SelectItem>
                    <SelectItem value="file">
                      <span className="flex items-center gap-2"><FileIcon className="h-3.5 w-3.5 text-slate-400" /> File</span>
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
              )}
            />
          </div>

          {/* LINK */}
          {type === "link" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">URL</Label>
              <Input
                placeholder="https://example.com"
                {...register("url")}
                className={`h-10 bg-muted/20 border-border/40 rounded-xl transition-all ${errors.url ? 'border-red-500/50 focus-visible:ring-red-500/50' : 'focus:border-primary/40'}`}
              />
              {errors.url && <p className="text-xs text-red-500">{errors.url.message as string}</p>}
            </div>
          )}

          {/* ARTICLE */}
          {type === "article" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Article Content</Label>
              <Textarea
                placeholder="Write article..."
                {...register("content")}
                className={`min-h-[200px] bg-muted/20 border-border/40 rounded-xl transition-all resize-none ${errors.content ? 'border-red-500/50 focus-visible:ring-red-500/50' : 'focus:border-primary/40'}`}
              />
              {errors.content && <p className="text-xs text-red-500">{errors.content.message as string}</p>}
            </div>
          )}

          {/* FILE INPUT */}
          {["file", "image", "video"].includes(type) && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Replace File (optional)</Label>
              <div className="relative">
                <label className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed ${errors.file ? 'border-red-500/50 bg-red-500/5' : 'border-border/40 bg-muted/10 hover:bg-muted/20 hover:border-primary/30'} transition-all cursor-pointer`}>
                  <Upload className={`h-5 w-5 mb-1.5 ${errors.file ? 'text-red-500/60' : 'text-muted-foreground/40'}`} />
                  <span className={`text-[13px] ${errors.file ? 'text-red-500/80' : 'text-muted-foreground/60'}`}>
                    {file ? file.name : "Click to select a new file"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0] || null
                      setValue("file", selectedFile, { shouldValidate: true })
                    }}
                  />
                </label>
              </div>
              {errors.file && <p className="text-xs text-red-500">{errors.file.message as string}</p>}
              {resource.file_url && (
                <a
                  href={resource.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-primary/70 hover:text-primary transition-colors inline-flex items-center gap-1 mt-2"
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
              placeholder="Optional description"
              {...register("description")}
              className="min-h-[80px] bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all resize-none"
            />
          </div>

          {/* TAGS */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground/80">Tags</Label>
            <Input
              placeholder="react, backend, ai"
              {...register("tags")}
              className="h-10 bg-muted/20 border-border/40 rounded-xl focus:border-primary/40 transition-all"
            />
            <p className="text-[11px] text-muted-foreground/40">
              Separate tags with commas
            </p>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
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

        </form>

      </DialogContent>

    </Dialog>
  )
}