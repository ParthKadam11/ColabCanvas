export function TextSettingsPanel({
  textColor,
  setTextColor,
  textSize,
  setTextSize,
}: {
  textColor: string;
  setTextColor: (color: string) => void;
  textSize: number;
  setTextSize: (size: number) => void;
}) {
  return (
    <div className="absolute top-40 right-[max(1rem,env(safe-area-inset-right))] z-30 flex min-w-44 flex-col gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-100 shadow-lg md:top-[max(1rem,env(safe-area-inset-top))]">
      <label className="flex items-center justify-between gap-3">
        <span>Color</span>
        <input
          type="color"
          aria-label="Text color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="size-8 cursor-pointer border-0 bg-transparent p-0"
        />
      </label>
      <label className="flex items-center justify-between gap-3">
        <span>Size</span>
        <span className="flex items-center gap-1">
          <input
            type="number"
            min={10}
            max={72}
            aria-label="Text size"
            value={textSize}
            onChange={(e) => setTextSize(Number(e.target.value))}
            className="w-16 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-right text-sm tabular-nums text-zinc-100 focus:outline-none"
          />
          <span className="text-xs text-zinc-400">px</span>
        </span>
      </label>
    </div>
  );
}
