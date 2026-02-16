import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="fixed top-2 sm:top-6 left-1/2 -translate-x-1/2 z-30 w-[98vw] max-w-4xl rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl shadow-lg border border-white/30 dark:border-zinc-700/40 transition-colors px-2 sm:px-0">
      <div className="flex items-center justify-between p-3 sm:p-6 py-2 sm:py-3 w-full">
        <Link href="/" className="text-xl xs:text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight select-none drop-shadow-sm">ColabCanvas</Link>
        <button className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu">
          <Menu/>
        </button>
        <div className="hidden md:flex items-center gap-5 sm:gap-7 text-base md:text-lg">
          <a href="#features" className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">Features</a>
          <a href="#demo" className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">Demo</a>
          <a href="https://github.com/ParthKadam11/ColabCanvas" target="_blank" rel="noopener noreferrer" className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">GitHub</a>
        </div>
        <div className="hidden md:flex">
          <a href="/signup" className="px-4 sm:px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors border border-blue-700 text-base">Try Demo</a>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-2 pb-4 animate-fade-in-up">
          <a href="#features" className="w-full text-center py-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">Features</a>
          <a href="#demo" className="w-full text-center py-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">Demo</a>
          <a href="https://github.com/ParthKadam11/ColabCanvas" target="_blank" rel="noopener noreferrer" className="w-full text-center py-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">GitHub</a>
          <a href="/signup" className="w-full text-center px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors border border-blue-700 text-base mt-2">Try Demo</a>
        </div>
      )}
    </nav>
  );
}
