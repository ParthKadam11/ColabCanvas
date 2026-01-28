import * as React from "react"
import { cn } from "./lib/utils"

const Input: React.FC<React.ComponentProps<"input">> = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "dark:bg-input/30 border border-zinc-300 dark:border-zinc-700 h-8 rounded-lg bg-transparent px-2.5 py-1 text-base transition-colors file:h-6 file:text-sm file:font-medium md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-zinc-500 focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

export { Input }