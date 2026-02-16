import { motion } from "framer-motion";
import { Presentation, RadioTower, Share } from "lucide-react";

const iconClass = "mb-4 text-white";
const iconSize = 32;
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
    <section id="features" className="relative z-10 max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="col-span-full flex flex-col items-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl md:text-4xl font-extrabold text-center text-white drop-shadow-lg"
        >
          Built for real-time collaboration
        </motion.h2>
        <span className="block h-1 w-56 md:w-100 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-yellow-300 animate-pulse mt-3" style={{animationDuration:'3s'}} />
      </div>
      {features.map((feature, idx) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 * idx }}
          className="bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow-xl p-8 border-2 border-white/60 dark:border-zinc-100/20 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          {feature.icon}
          <h3 className="text-xl font-semibold mb-2 text-white text-center drop-shadow-sm">
            {feature.title}
          </h3>
          <p className="text-zinc-700 dark:text-zinc-200 text-center text-base">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </section>
  );
}
