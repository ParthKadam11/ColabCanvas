"use client"
import { useRef } from "react";
import { motion } from "framer-motion";

const VIDEO_WIDTH = 1000;

export default function DemoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.2, ease: [0.43, 0.13, 0.23, 0.96] as const },
        opacity: { duration: 0.4 },
      },
    },
  };

  return (
    <section ref={sectionRef} className="w-full py-12 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-black dark:text-white drop-shadow-lg">
        See ColabCanvas in action
      </h2>
      <div className="relative mt-2 xs:mt-3 mb-10 h-7 w-52 xs:w-72 sm:w-80 md:w-[30rem]">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 420 80"
          preserveAspectRatio="none"
          initial="hidden"
          animate="visible"
          className="w-full h-full"
        >
          <title>Signature underline</title>
          <motion.path
            d="M 20 52 C 92 52, 156 44, 214 40 C 278 34, 338 28, 400 22"
            fill="none"
            strokeWidth="11"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className="text-zinc-900 dark:text-white opacity-80"
          />
        </motion.svg>
      </div>
      <div className="w-full flex justify-center">
        <div
          className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-700 bg-black"
          style={{ width: VIDEO_WIDTH, maxWidth: '100%' }}
        >
          <video
            ref={videoRef}
            src="/ColabCanvas.mov"
            className="w-full h-full object-cover bg-black"
            poster="/video-poster.png"
            loop
            autoPlay
            muted
            playsInline
            style={{ width: '100%', height: '100%' }}
          >
            Sorry, your browser does not support embedded videos.
          </video>
        </div>
      </div>
    </section>
  );
}
