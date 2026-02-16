export default function DemoVideoSection({ videoUrl }: { videoUrl: string }) {
  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col items-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 text-black dark:text-white drop-shadow-lg">
        See ColabCanvas in action
      </h2>
      <div className="w-full flex justify-center">
        <div className="aspect-video w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-700 bg-black">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover bg-black"
            poster="/video-poster.png"
          >
            Sorry, your browser does not support embedded videos.
          </video>
        </div>
      </div>
    </section>
  );
}
