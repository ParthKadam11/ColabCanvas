import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800 font-sans">
      <nav className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-4 sm:px-8 py-4 sm:py-6 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-lg border-b border-white/30 dark:border-zinc-700/40 fixed top-0 left-0 z-20">
        <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-white drop-shadow-sm">ColabCanvas</Link>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center">
          <a href="/features" className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors flex items-center">Features</a>
          <a href="/pricing" className="text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors flex items-center">Pricing</a>
          <a href="/signin" className="px-4 py-2 rounded-xl bg-zinc-900/80 dark:bg-white/20 text-white dark:text-zinc-100 font-semibold shadow-md hover:bg-zinc-900 hover:dark:bg-white/30 transition-colors border border-white/20 dark:border-zinc-700/30">Login</a>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-screen pt-28 sm:pt-32 pb-16 px-4">
        <div className="relative z-10 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl shadow-xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-lg border border-white/30 dark:border-zinc-700/40 max-w-2xl w-full mx-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-4 drop-shadow-sm text-center">ColabCanvas</h1>
          <p className="text-xl text-zinc-700 dark:text-zinc-200 mb-8 text-center max-w-lg">
            A modern, collaborative whiteboard for teams and creators. Draw, brainstorm, and share ideas in real time—beautifully simple, endlessly powerful.
          </p>
          <a
            href="/signup"
            className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-zinc-900/80 dark:bg-white/20 text-white dark:text-zinc-100 font-semibold shadow-md hover:bg-zinc-900 hover:dark:bg-white/30 transition-colors backdrop-blur-md border border-white/20 dark:border-zinc-700/30 text-base sm:text-lg">
            Get Started
          </a>
        </div>
      </div>

      <section className="relative z-10 max-w-5xl mx-auto px-4 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white/70 dark:bg-zinc-900/70 rounded-xl shadow-lg p-6 border border-white/20 dark:border-zinc-700/30 flex flex-col items-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4 text-zinc-900 dark:text-white"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">Real-time Collaboration</h3>
          <p className="text-zinc-700 dark:text-zinc-200 text-center">Work together with your team instantly. See changes live and brainstorm seamlessly.</p>
        </div>
        <div className="bg-white/70 dark:bg-zinc-900/70 rounded-xl shadow-lg p-6 border border-white/20 dark:border-zinc-700/30 flex flex-col items-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4 text-zinc-900 dark:text-white"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">Infinite Canvas</h3>
          <p className="text-zinc-700 dark:text-zinc-200 text-center">Draw, write, and organize ideas on a limitless canvas. No boundaries to creativity.</p>
        </div>
        <div className="bg-white/70 dark:bg-zinc-900/70 rounded-xl shadow-lg p-6 border border-white/20 dark:border-zinc-700/30 flex flex-col items-center">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4 text-zinc-900 dark:text-white"><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>
          <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">Easy Sharing</h3>
          <p className="text-zinc-700 dark:text-zinc-200 text-center">Share boards with a link, export as images, or embed in docs. Collaboration made simple.</p>
        </div>
      </section>
    </div>
  );
}
