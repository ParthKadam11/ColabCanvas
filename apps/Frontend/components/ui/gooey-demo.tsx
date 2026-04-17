"use client"

import { useScreenSize } from "@/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"
import { GooeyFilter } from "@/components/ui/gooey-filter"
import Image from "next/image"

function GooeyDemo() {
  const screenSize = useScreenSize()

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-center gap-8 bg-black text-center text-pretty overflow-hidden">
      <Image
        src="/WhiteBg.png"
        alt="abstract background"
        className="w-full h-full object-cover absolute inset-0 opacity-70"
      />

      <GooeyFilter id="gooey-filter-pixel-trail" strength={0} />

      <div
        className="absolute inset-0 z-0"
        style={{ filter: "url(#gooey-filter-pixel-trail)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 24 : 32}
          fadeDuration={520}
          delay={0}
          pixelClassName="bg-white rounded-none"
        />
      </div>

      <p className="text-white text-5xl md:text-7xl z-10 w-[min(90%,42rem)] font-bold">
        Speaking things into existence
      </p>
    </div>
  )
}

export { GooeyDemo }

