"use client"

import { useScreenSize } from "@/hooks/use-screen-size"
import { GooeyFilter } from "@/components/ui/gooey-filter"
import { PixelTrail } from "@/components/ui/pixel-trail"

export default function LandingGooeyBackground() {
  const screenSize = useScreenSize()
  const gridSize = screenSize.lessThan("md") ? 24 : 32

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <GooeyFilter id="landing-gooey-filter" strength={0} />

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#070707",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{ filter: "url(#landing-gooey-filter)" }}
      >
        <PixelTrail
          pixelSize={gridSize}
          fadeDuration={520}
          delay={0}
          pixelClassName="bg-white rounded-none"
        />
      </div>
    </div>
  )
}

