import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-6 xs:py-8 px-2 xs:px-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-white flex flex-col items-center">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-5xl mx-auto gap-3 xs:gap-4 px-1 xs:px-0">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base xs:text-lg tracking-tight">ColabCanvas</span>
          <span className="text-xs font-medium bg-blue-600 px-2 py-1 rounded-full ml-2">v.1.0</span>
        </div>
        <div className="flex gap-3 xs:gap-6 text-xs xs:text-sm flex-wrap justify-center">
          <Link href="https://github.com/ParthKadam11/ColabCanvas" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub</Link>
          <Link href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">React</Link>
          <Link href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">TailwindCSS</Link>
          <Link href="https://www.prisma.io/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Prisma</Link>
          <Link href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Framer Motion</Link>
        </div>
      </div>
      <div className="mt-4 xs:mt-6 text-xs text-zinc-400 text-center px-1 xs:px-0">
        \u00a9 {new Date().getFullYear()} ColabCanvas. All rights reserved.
      </div>
    </footer>
  );
}
