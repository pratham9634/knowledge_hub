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
import { Plus, Loader2, Link2, FileText, ImageIcon, Video, File as FileIcon, Upload } from "lucide-react"

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

const formSchema = z.object({
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
  if (["file", "image", "video"].includes(data.type) && !data.file) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a file",
      path: ["file"]
    });
  }
});

type FormData = z.infer<typeof formSchema>

export default function AddResourceModal() {

  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "link",
      description: "",
      tags: "",
      url: "",
      content: "",
      file: undefined,
    }
  })

  const { register, control, watch, handleSubmit, setValue, reset, formState: { errors } } = form

  const type = watch("type")
  const file = watch("file")

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      toast.success("Resource created successfully")
      queryClient.invalidateQueries({ queryKey: ["resources"] })
      setOpen(false)
    },
    onError: (error: any) => {
      const errDetail = error?.response?.data?.detail
      const errorMessage = Array.isArray(errDetail) ? errDetail[0].msg : errDetail
      toast.error(errorMessage || "Failed to create resource")
    },
  })

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

          {/* LINK URL */}
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

          {/* ARTICLE CONTENT */}
          {type === "article" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">Article Content</Label>
              <Textarea
                placeholder="Write your article..."
                {...register("content")}
                className={`min-h-[180px] bg-muted/20 border-border/40 rounded-xl transition-all resize-none ${errors.content ? 'border-red-500/50 focus-visible:ring-red-500/50' : 'focus:border-primary/40'}`}
              />
              {errors.content && <p className="text-xs text-red-500">{errors.content.message as string}</p>}
            </div>
          )}

          {/* FILE INPUT */}
          {["file", "image", "video"].includes(type) && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80">
                {type === "image" ? "Upload Image" : type === "video" ? "Upload Video" : "Upload File"}
              </Label>
              <div className="relative">
                <label className={`flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed ${errors.file ? 'border-red-500/50 bg-red-500/5' : 'border-border/40 bg-muted/10 hover:bg-muted/20 hover:border-primary/30'} transition-all cursor-pointer`}>
                  <Upload className={`h-6 w-6 mb-2 ${errors.file ? 'text-red-500/60' : 'text-muted-foreground/40'}`} />
                  <span className={`text-[13px] ${errors.file ? 'text-red-500/80' : 'text-muted-foreground/60'}`}>
                    {file ? file.name : "Click to select a file"}
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

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
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

        </form>

      </DialogContent>

    </Dialog>
  )
}
