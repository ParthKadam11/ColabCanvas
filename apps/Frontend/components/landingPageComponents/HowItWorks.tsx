"use client";
import { motion } from "framer-motion";

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
            className="relative flex flex-col items-center justify-start bg-white dark:bg-zinc-800 rounded-xl shadow-lg px-6 pt-12 pb-8 min-h-[240px] overflow-visible border-0"
          >
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 rounded-full shadow-md p-4 border-4 border-blue-200 dark:border-zinc-700 flex items-center justify-center transition-transform duration-200 hover:scale-110 cursor-pointer"
              style={{zIndex:2}}
            >
              <span className="text-3xl">{step.icon}</span>
            </div>
            <div className="mt-6 text-xs font-bold tracking-widest text-blue-400 dark:text-blue-300 uppercase">Step {idx + 1}</div>
            <h3 className="text-lg font-extrabold mb-2 text-zinc-900 dark:text-white text-center leading-tight">
              {step.title}
            </h3>
            <div className="text-zinc-600 dark:text-zinc-300 text-center text-base max-w-xs mx-auto">
              {step.desc}
            </div>
          </motion.div>
      ))}
    </section>
  );
}
