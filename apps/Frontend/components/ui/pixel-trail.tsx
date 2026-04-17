"use client"

import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/components/hooks/use-debounced-dimensions"

type PixelNode = HTMLDivElement & { __animatePixel?: () => void }

interface PixelTrailProps {
  pixelSize: number // px
  fadeDuration?: number // ms
  delay?: number // ms
  className?: string
  pixelClassName?: string
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  pixelSize = 60,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)
  const trailId = useMemo(() => uuidv4(), [])

  const triggerAtClientPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.floor((clientX - rect.left) / pixelSize)
      const y = Math.floor((clientY - rect.top) / pixelSize)

      if (x < 0 || y < 0) return

      const pixelElement = document.getElementById(
        `${trailId}-pixel-${x}-${y}`
      )
      const animatePixel = (pixelElement as PixelNode | null)?.__animatePixel
      if (animatePixel) animatePixel()
    },
    [pixelSize, trailId]
  )

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      triggerAtClientPoint(e.clientX, e.clientY)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", onPointerMove)
  }, [triggerAtClientPoint])

  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      const touch =
        e.touches?.[0] ?? e.changedTouches?.[0] ?? (null as Touch | null)
      if (!touch) return
      triggerAtClientPoint(touch.clientX, touch.clientY)
    }

    window.addEventListener("touchstart", onTouch, { passive: true })
    window.addEventListener("touchmove", onTouch, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onTouch)
      window.removeEventListener("touchmove", onTouch)
    }
  }, [triggerAtClientPoint])

  const columns = useMemo(
    () => Math.ceil(dimensions.width / pixelSize),
    [dimensions.width, pixelSize]
  )
  const rows = useMemo(
    () => Math.ceil(dimensions.height / pixelSize),
    [dimensions.height, pixelSize]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none select-none",
        className
      )}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface PixelDotProps {
  id: string
  size: number
  fadeDuration: number
  delay: number
  className?: string
}

const PixelDot: React.FC<PixelDotProps> = React.memo(
  ({ id, size, fadeDuration, delay, className }) => {
    const controls = useAnimationControls()

    const animatePixel = useCallback(() => {
      controls.stop()
      controls.set({ opacity: 1 })
      controls.start({
        opacity: 0,
        transition: {
          duration: fadeDuration / 1000,
          delay: delay / 1000,
          ease: "linear",
        },
      })
    }, [controls, delay, fadeDuration])

    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        if (!node) return
        ;(node as PixelNode).__animatePixel = animatePixel
      },
      [animatePixel]
    )

    return (
      <motion.div
        id={id}
        ref={ref}
        className={cn("pointer-events-none", className)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        initial={{ opacity: 0 }}
        animate={controls}
        exit={{ opacity: 0 }}
      />
    )
  }
)

PixelDot.displayName = "PixelDot"
export { PixelTrail }

