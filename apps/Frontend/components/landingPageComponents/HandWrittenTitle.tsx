"use client";

import { motion } from "framer-motion";

interface HandWrittenTitleProps {
  title?: string;
}

export default function HandWrittenTitle({
  title = "Hand Written",
}: HandWrittenTitleProps) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] as const },
        opacity: { duration: 0.5 },
      },
    },
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[210px] sm:min-h-[260px] md:min-h-[300px] py-5 sm:py-7 md:py-9">
      <div className="absolute inset-0 pointer-events-none">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
          initial="hidden"
          animate="visible"
          className="w-full h-full"
        >
          <title>Handwritten outline</title>
          <motion.path
            d="M 945 110
               C 1128 290, 1065 520, 600 548
               C 220 546, 115 500, 104 335
               C 95 150, 305 98, 600 94
               C 860 92, 950 198, 950 198"
            fill="none"
            strokeWidth="11"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className="text-zinc-900 dark:text-white opacity-80 sm:hidden"
          />
          <motion.path
            d="M 950 105
              C 1140 310, 1080 610, 600 635
              C 220 630, 105 575, 95 360
              C 86 145, 300 95, 600 92
              C 870 90, 955 205, 955 205"
            fill="none"
            strokeWidth="12"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={draw}
            className="hidden sm:block text-zinc-900 dark:text-white opacity-80"
          />
        </motion.svg>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center text-center px-6 sm:px-10 md:px-14 py-8 sm:py-11 md:py-14">
        <motion.h2
          className="max-w-[18ch] sm:max-w-none text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-lg leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
}