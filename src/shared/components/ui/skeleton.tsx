import type React from "react"
import { cn } from "@/shared/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse mx-auto rounded-sm bg-muted-foreground", className)} {...props} />
}

export { Skeleton }
