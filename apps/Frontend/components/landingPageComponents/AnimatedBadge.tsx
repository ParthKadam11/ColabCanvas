import * as React from "react";

import BadgeTag from "@/components/ui/badge-tag";

export default function AnimatedBadge({ children }: { children: React.ReactNode }) {
  return (
    <BadgeTag
      className="mx-auto"
      label={children}
    />
  );
}
