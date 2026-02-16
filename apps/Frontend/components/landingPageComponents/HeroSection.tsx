import AnimatedBadge from "./AnimatedBadge";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-28 sm:pt-32 pb-16 px-4">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[420px] h-[420px] rounded-full bg-gradient-to-br from-yellow-2 00/40 via-pink-200/30 to-blue-200/40 blur-3xl opacity-60 dark:from-yellow-900/30 dark:via-pink-900/20 dark:to-blue-900/30"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <AnimatedBadge>
          <span className="text-xl">✨</span> Real-time collaborative canvas
        </AnimatedBadge>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-lg mb-4 animate-fade-in-up">
          Draw together. Think visually.<br className="hidden sm:inline" /> Ship faster.
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-700 dark:text-zinc-200 max-w-2xl mb-6 animate-fade-in-up delay-100">
          A simple real-time whiteboard for teams and creators.<br className="hidden sm:inline" /> No installs. Just share a link and start collaborating instantly.
        </h2>
        <div className="flex gap-4 mt-2 animate-fade-in-up delay-200">
          <a
            href="/signup"
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors border border-blue-700 text-base"
          >
            Get Started
          </a>
          <a href="#features" className="px-6 py-2 rounded-xl bg-white/80 dark:bg-zinc-900/40 text-zinc-900 dark:text-white font-semibold shadow-md hover:bg-blue-700:text-blue-600 hover:dark:bg-zinc-800 transition-colors border border-zinc-300 dark:border-zinc-700 text-base">See Features</a>
        </div>
      </div>
    </div>
  );
}
