"use client";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/spotlight-card";

export default function HowItWorks() {
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

  const glowColors = ["blue" as const, "purple" as const, "green" as const];
  const steps = [
    {
      title: "Create a room",
      desc: "Start a collaborative canvas in seconds with a unique room.",
      icon: (
        <span className="inline-block text-2xl">📝</span>
      ),
    },
    {
      title: "Share Room",
      desc: "Invite others instantly by sending the room name.",
      icon: (
        <span className="inline-block text-2xl">🔗</span>
      ),
    },
    {
      title: "Draw together in real time",
      desc: "Everyone can sketch, edit, and see updates live.",
      icon: (
        <span className="inline-block text-2xl">🤝</span>
      ),
    },
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-2 xs:px-4 py-10 xs:py-14 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 scroll-mt-24">
      <div className="col-span-full flex flex-col items-center mb-6 sm:mb-10 px-2">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-2xl xs:text-3xl md:text-4xl font-extrabold text-center text-black dark:text-white drop-shadow-lg leading-tight"
        >
          How it works
        </motion.h2>
        <div className="relative mt-2 xs:mt-3 h-7 w-40 xs:w-60 md:w-72">
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
      {steps.map((step, idx) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 * idx }}
          className="h-full"
        >
          <GlowCard
            customSize
            glowColor={glowColors[idx % glowColors.length]}
            className="h-full min-h-[210px] p-0 backdrop-blur-xl transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="relative z-10 flex h-full flex-col items-center justify-start rounded-2xl px-5 pt-14 pb-6 xs:px-6 sm:px-8">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/60 bg-zinc-900 shadow-lg leading-none">
                <span className="flex items-center justify-center text-3xl">{step.icon}</span>
              </div>
              <div className="mt-2 text-xs font-bold tracking-widest text-white/60 uppercase">Step {idx + 1}</div>
              <h3 className="mb-2 text-lg font-semibold text-white text-center leading-tight xs:text-xl">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/80 text-center xs:text-base">
                {step.desc}
              </p>
            </div>
          </GlowCard>
        </motion.div>
      ))}
    </section>
  );
}
