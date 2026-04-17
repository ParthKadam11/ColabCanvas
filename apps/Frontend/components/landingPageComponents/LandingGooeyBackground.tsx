"use client"

import { useScreenSize } from "@/hooks/use-screen-size"
import { GooeyFilter } from "@/components/ui/gooey-filter"
import { PixelTrail } from "@/components/ui/pixel-trail"

export default function LandingGooeyBackground() {
  const screenSize = useScreenSize()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <GooeyFilter id="landing-gooey-filter" strength={0} />

      <div
        className="absolute inset-0"
        style={{ filter: "url(#landing-gooey-filter)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 24 : 32}
          fadeDuration={520}
          delay={0}
          pixelClassName="bg-white rounded-xs"
        />
      </div>
    </div>
  )
}

