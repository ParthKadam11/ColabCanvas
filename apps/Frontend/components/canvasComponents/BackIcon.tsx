import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackIcon() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Back to rooms"
      className="fixed top-[max(1rem,env(safe-area-inset-top))] left-[max(1rem,env(safe-area-inset-left))] z-30 flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 shadow-lg hover:bg-zinc-800"
      onClick={() => router.push("/room")}
    >
      <ArrowLeft className="size-4" />
      Rooms
    </button>
  );
}
