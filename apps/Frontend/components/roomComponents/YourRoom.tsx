"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND;

type RoomItem = {
  id: number;
  slug: string;
  createdAt: string;
  memberCount: number;
};

type YourRoomProps = {
  refreshKey?: number;
};

export default function YourRoom({ refreshKey }: YourRoomProps) {
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadRooms = async () => {
    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : "";
      if (!token) {
        setError("Sign in again to see your rooms.");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${HTTP_BACKEND}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data?.rooms ?? []);
      setError(null);
    } catch (e) {
      setError("Could not load rooms. Check that you are signed in.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [refreshKey]);

  const handleDelete = async (roomId: number) => {
    if (!window.confirm("Delete this room? This cannot be undone.")) return;
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : "";
      await axios.delete(`${HTTP_BACKEND}/room/${roomId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    } catch (e: unknown) {
      setError("Could not delete that room.");
      if (axios.isAxiosError(e)) {
        if (e.response) {
          console.error("Delete room error:", {
            status: e.response.status,
            data: e.response.data,
          });
        }
      } else {
        console.error("Delete room error:", e);
      }
    }
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-medium text-balance text-zinc-50">Recent rooms</h2>
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-16 rounded-xl border border-zinc-800 bg-zinc-900" />
          ))}
        </div>
      )}

      {!loading && rooms.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-zinc-800 px-5 py-8 text-center">
          <p className="text-sm font-medium text-zinc-200">No rooms yet</p>
          <p className="mt-1 text-sm text-pretty text-zinc-400">
            Create a room above to open your first board.
          </p>
        </div>
      )}

      {!loading && rooms.length > 0 && (
        <div className="space-y-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-zinc-50">{room.slug}</div>
                <div className="mt-1 text-xs text-zinc-500 tabular-nums">
                  {new Date(room.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {" · "}
                  {room.memberCount} {room.memberCount === 1 ? "member" : "members"}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  onClick={() => router.push(`/canvas/${room.id}`)}
                >
                  Open
                </button>
                <button
                  className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-medium text-red-400 hover:bg-zinc-800"
                  onClick={() => handleDelete(room.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
