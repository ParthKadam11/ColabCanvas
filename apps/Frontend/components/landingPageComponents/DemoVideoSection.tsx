import { useEffect, useRef } from "react";

const VIDEO_WIDTH = 1000;

export default function DemoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-12 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-black dark:text-white drop-shadow-lg">
        See ColabCanvas in action
      </h2>
      <span className="block h-1 w-36 xs:w-56 md:w-120 rounded-full bg-gradient-to-r from-blue-400 via-fuchsia-400 to-yellow-300 animate-pulse mt-2 xs:mt-3 mb-10" style={{animationDuration:'4s'}} />
      <div className="w-full flex justify-center">
        <div
          className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-700 bg-black"
          style={{ width: VIDEO_WIDTH, maxWidth: '100%' }}
        >
          <video
            ref={videoRef}
            src="/ColabCanvas.mov"
            className="w-full h-full object-cover bg-black"
            poster="/video-poster.png"
            loop
            style={{ width: '100%', height: '100%' }}
          >
            Sorry, your browser does not support embedded videos.
          </video>
        </div>
      </div>
    </section>
  );
}
