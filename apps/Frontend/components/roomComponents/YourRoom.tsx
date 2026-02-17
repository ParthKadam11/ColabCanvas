"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HTTP_BACKEND=process.env.NEXT_PUBLIC_HTTP_BACKEND


type RoomItem = {
  id: number;
  slug: string;
  createdAt: string;
  memberCount: number;
};

type YourRoomProps = {
  token: string | null;
  refreshKey?: number;
};

export function YourRoom({ token, refreshKey }: YourRoomProps) {
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadRooms = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${HTTP_BACKEND}/rooms`, {
        headers: { authorization: authToken },
      });
      setRooms(response.data?.rooms ?? []);
      setError(null);
    } catch (e) {
      setError("Failed to load rooms");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadRooms(token);
  }, [token, refreshKey]);

  const handleDelete = async (roomId: number) => {
    if (!token) return;
    try {
      await axios.delete(`${HTTP_BACKEND}/room/${roomId}`, {
        headers: { authorization: token },
      });
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
    } catch (e: unknown) {
      setError("Failed to delete room");
      if (axios.isAxiosError(e)) {
        if (e.response) {
          console.error('Delete room error:', {
            status: e.response.status,
            data: e.response.data,
            headers: e.response.headers,
          });
        } else if (e.request) {
          console.error('Delete room error: No response received', e.request);
        } else {
          console.error('Delete room error:', e.message);
        }
      } else {
        console.error('Delete room error:', e);
      }
    }
  };

  return (
    <div className="mt-6 xs:mt-8 rounded-xl bg-white p-6 xs:p-5 shadow-sm text-black w-full flex-shrink-0">
      <div className="mb-3 xs:mb-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-0">
        <h2 className="text-base xs:text-lg font-medium">Recent rooms</h2>
        {loading && <span className="text-xs xs:text-sm text-zinc-500">Loading...</span>}
      </div>

      {error && <div className="mb-2 xs:mb-3 text-xs xs:text-sm text-red-600">{error}</div>}

      {!loading && rooms.length === 0 && (
        <div className="text-xs xs:text-sm">No rooms yet.</div>
      )}

      <div className="space-y-2 xs:space-y-3">
        {rooms.map((room) => (
          <div key={room.id} className="flex flex-col xs:flex-row xs:items-center justify-between shadow-sm rounded-lg border border-zinc-200 px-3 xs:px-4 py-2 xs:py-3 gap-2 xs:gap-0">
            <div>
              <div className="font-medium text-sm xs:text-base">{room.slug}</div>
              <div className="text-xs text-zinc-500">
                Created {new Date(room.createdAt).toLocaleString()} | {" "}
                {room.memberCount} members 
              </div>
            </div>
            <div className="flex gap-1 xs:gap-2 mt-1 xs:mt-0">
              <button className="rounded-lg border border-zinc-300 px-3 xs:px-4 py-1.5 xs:py-2 text-sm xs:text-base text-white bg-blue-600" onClick={() =>
                  router.push(`/canvas/${room.id}?token=${token}`)
                }>Open </button>
              <button className="rounded-lg border border-red-200 px-3 xs:px-4 py-1.5 xs:py-2 text-sm xs:text-base text-white bg-red-600/80" onClick={() => handleDelete(room.id)}> Delete </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
