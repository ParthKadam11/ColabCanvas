"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type BadgeTagProps = {
  label?: React.ReactNode;
  leftText?: string;
  className?: string;
  icon?: React.ReactNode;
};

export function BadgeTag({
  label = "Real-time Collaborative Canvas",
  leftText = "Live",
  icon,
  className,
}: BadgeTagProps) {
  const isLabelString = typeof label === "string";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-zinc-300/60 bg-white/60 px-2 py-1 text-sm backdrop-blur",
        "shadow-sm dark:border-zinc-700/60 dark:bg-zinc-950/30",
        className,
      )}
    >
      <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300/60 bg-white px-2.5 py-1 text-xs font-medium text-zinc-800 dark:border-zinc-700/60 dark:bg-zinc-900/40 dark:text-amber-400">
        {icon ?? <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
        <span>{leftText}</span>
      </div>

      <span className="pr-2.5 font-medium">
        {isLabelString ? (
          <span className="bg-gradient-to-r from-rose-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
            {label}
          </span>
        ) : (
          label
        )}
      </span>
    </div>
  );
}

export default BadgeTag;

