import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative z-10 w-full py-10 xs:py-14 sm:py-16 px-2 xs:px-4 flex flex-col items-center justify-center">
      <div className="max-w-xl sm:max-w-2xl w-full flex flex-col items-center text-center px-1 xs:px-2">
        <h2 className="text-2xl xs:text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg mb-3 sm:mb-4 leading-tight">
          Ready to collaborate visually?
        </h2>
        <p className="text-base xs:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-snug">
          Sign up now and start drawing together in real time. No installs, no hassle just instant collaboration.
        </p>
        <div className="flex flex-row gap-3 sm:gap-4 w-full xs:w-auto justify-center items-center flex-wrap">
          <Link
            href="/signup"
            className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-blue-600 text-white font-bold text-base sm:text-lg shadow-md hover:bg-blue-700 transition-colors border border-blue-700 flex items-center justify-center text-center"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  );
}
