import Link from "next/link";
import AnimatedBadge from "./AnimatedBadge";

export default function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen pt-20 sm:pt-28 md:pt-32 pb-10 sm:pb-16 px-2 sm:px-6 md:px-10 w-full overflow-x-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-60 h-60 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-br from-yellow-200/40 via-pink-200/30 to-blue-200/40 blur-3xl opacity-60 dark:from-yellow-900/30 dark:via-pink-900/20 dark:to-blue-900/30"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl px-2 sm:px-0">
        <AnimatedBadge>
          <span className="text-base md:text-lg">✨</span> <span className="text-xs xs:text-sm sm:text-base">Real-time collaborative canvas</span>
        </AnimatedBadge>
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-lg mb-3 sm:mb-4 animate-fade-in-up leading-tight">
          Draw together. Think visually.<br className="hidden sm:inline" /> Ship faster.
        </h2>
        <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-medium text-zinc-700 dark:text-zinc-200 max-w-xs sm:max-w-xl md:max-w-2xl mb-4 sm:mb-6 animate-fade-in-up delay-100 leading-snug">
          A simple real-time whiteboard for teams and creators.<br className="hidden sm:inline" /> No installs. Just share a room and start collaborating instantly.
        </h3>
        <div className="flex flex-row gap-3 sm:gap-4 mt-2 animate-fade-in-up delay-200 w-full xs:w-auto justify-center items-center flex-wrap">
          <Link
            href="/signup"
            className="px-4 sm:px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors border border-blue-700 text-base text-center">
            Get Started
          </Link>
          <Link href="/signin" className="px-4 sm:px-6 py-2 rounded-xl bg-white/80 dark:bg-zinc-900/40 text-zinc-900 dark:text-white font-semibold shadow-md hover:bg-blue-700:text-blue-600 hover:dark:bg-zinc-800 transition-colors border border-zinc-300 dark:border-zinc-700 text-base text-center">Login</Link>
        </div>
      </div>
    </div>
  );
}
