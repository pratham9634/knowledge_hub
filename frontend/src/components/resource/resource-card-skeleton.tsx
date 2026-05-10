import { Skeleton } from "@/components/ui/skeleton"


export default function ResourceCardSkeleton() {

  return (

    <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm">

      {/* Accent bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-muted/40" />

      <div className="p-5 space-y-4">

        {/* Top */}
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0 bg-muted/30" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-lg bg-muted/30" />
            <Skeleton className="h-3.5 w-full rounded-lg bg-muted/20" />
          </div>
          <Skeleton className="h-5 w-14 rounded-lg shrink-0 bg-muted/30" />
        </div>

        {/* Tags */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-md bg-muted/20" />
          <Skeleton className="h-5 w-18 rounded-md bg-muted/20" />
          <Skeleton className="h-5 w-12 rounded-md bg-muted/20" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/20">
          <Skeleton className="h-3 w-20 rounded-md bg-muted/20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-lg bg-muted/30" />
            <Skeleton className="h-8 w-8 rounded-lg bg-muted/20" />
          </div>
        </div>

      </div>

      {/* Shimmer Overlay */}
      <div className="absolute inset-0 animate-shimmer" />

    </div>
  )
}