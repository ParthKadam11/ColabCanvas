"use client";
import { motion } from "framer-motion";
import { Presentation, RadioTower, Share } from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";

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

const iconClass = "block text-white";
const iconSize = 32;
const featureToneMap = [
  {
    glowColor: "blue" as const,
  },
  {
    glowColor: "purple" as const,
  },
  {
    glowColor: "green" as const,
  },
];
const features = [
  {
    icon: (
      <RadioTower size={iconSize} className={iconClass} />
    ),
    title: "Live Presence",
    description: "See who's in the room and drawing instantly."
  },
  {
    icon: (
      <Share size={iconSize} className={iconClass} />
    ),
    title: "Shareable Rooms",
    description: "Create a link and collaborate immediately."
  },
  {
    icon: (
      <Presentation size={iconSize} className={iconClass} />
    ),
    title: "Fast Canvas",
    description: "Lightweight drawing with smooth realtime sync."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 max-w-6xl mx-auto px-2 xs:px-4 py-10 xs:py-14 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 scroll-mt-24">
      <div className="col-span-full flex flex-col items-center mb-6 sm:mb-10 px-2">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-2xl xs:text-3xl md:text-4xl font-extrabold text-center text-white drop-shadow-lg leading-tight"
        >
          Built for real-time collaboration
        </motion.h2>
        <div className="relative mt-2 xs:mt-3 h-7 w-52 xs:w-72 sm:w-80 md:w-[30rem]">
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
      </div>
      {features.map((feature, idx) => {
        const tone = featureToneMap[idx % featureToneMap.length];

        return (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 * idx }}
          className="h-full"
        >
          <GlowCard
            customSize
            glowColor={tone.glowColor}
            className="h-full min-h-[210px] p-0 backdrop-blur-xl transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="relative z-10 flex h-full flex-col items-center justify-between rounded-2xl px-5 pb-6 pt-10 xs:px-6 sm:px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/60 bg-zinc-900 shadow-sm leading-none">
                <span className="flex items-center justify-center text-3xl">{feature.icon}</span>
              </div>
              <div className="mt-4 text-center">
                <h3 className="mb-2 text-lg font-semibold text-white xs:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/80 xs:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          </GlowCard>
        </motion.div>
        );
      })}
    </section>
  );
}
