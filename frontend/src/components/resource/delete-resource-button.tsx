"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import { useDeleteResource } from "@/hooks/use-delete-resource"


type Props = {
  resourceId: string
  onDeleted?: () => void
}


export default function DeleteResourceButton({
  resourceId,
  onDeleted
}: Props) {

  const { mutate, isPending } = useDeleteResource()

  const handleDelete = () => {
    mutate(
      resourceId,
      {
        onSuccess: () => {
          onDeleted?.()
        }
      }
    )
  }

  return (
    <AlertDialog>

      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30">

        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-lg font-bold">
              Delete Resource?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-[14px] text-muted-foreground/70 pl-[52px]">
            This action cannot be undone. Uploaded files and videos will also be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel className="rounded-xl border-border/40 bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-xl bg-destructive hover:bg-destructive/90 transition-all cursor-pointer"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  )
}