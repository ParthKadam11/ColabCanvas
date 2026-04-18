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
        "inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-zinc-950/[0.03] px-2 py-1 text-sm backdrop-blur-md",
        "shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_12px_30px_-22px_rgba(161,98,7,0.6)]",
        "dark:border-amber-200/20 dark:bg-zinc-900/45 dark:shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_12px_30px_-22px_rgba(251,191,36,0.35)]",
        className,
      )}
    >
      <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-gradient-to-b from-amber-50 to-amber-100/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-900 dark:border-amber-200/30 dark:from-amber-300/20 dark:to-amber-200/10 dark:text-amber-200">
        {icon ?? <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
        <span>{leftText}</span>
      </div>

      <span className="pr-2.5 font-semibold tracking-tight">
        {isLabelString ? (
          <span className="text-zinc-800 dark:text-zinc-100">
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

