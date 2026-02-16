import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-30 w-[95vw] max-w-4xl rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl shadow-lg border border-white/30 dark:border-zinc-700/40 transition-colors">
      <div className="flex items-center justify-between p-6 py-3">
        <Link href="/" className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight select-none drop-shadow-sm">ColabCanvas</Link>
        <div className="hidden md:flex items-center gap-7 text-base md:text-lg">
          <a href="#features" className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">Features</a>
          <a href="#demo" className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">Demo</a>
          <a href="https://github.com/ParthKadam11/ColabCanvas" target="_blank" rel="noopener norxeferrer" className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">GitHub</a>
        </div>
        <div className="hidden md:flex">
          <a href="#demo" className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors border border-blue-700 text-base">Try Demo</a>
        </div>
      </div>
    </nav>
  );
}
