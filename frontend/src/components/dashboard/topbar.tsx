import { Input }
from "@/components/ui/input"

import { Search }
from "lucide-react"


export default function Topbar() {

  return (

    <header className="
      h-16
      border-b
      bg-background
      px-6
      flex
      items-center
      justify-between
      rounded-lg
      border-slate-600
      m-2
    ">

      <div className="
        relative
        w-full
        max-w-md
      ">

        <Search className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          h-4
          w-4
          text-muted-foreground
        " />

        <Input
          placeholder="Search resources..."
          className="pl-10"
        />

      </div>

    </header>
  )
}