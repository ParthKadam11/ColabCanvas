"use client";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    } catch (e) {
      setError("Failed to delete room");
      console.log(e);
    }
  };

  return (
    <div className="mt-8 rounded-xl bg-white p-5 shadow-sm text-black">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Your rooms</h2>
        {loading && <span className="text-sm text-zinc-500">Loading...</span>}
      </div>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      {!loading && rooms.length === 0 && (
        <div className="text-sm">No rooms yet.</div>
      )}

      <div className="space-y-3">
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center justify-between shadow-sm rounded-lg border border-zinc-200 px-4 py-3">
            <div>
              <div className="font-medium">{room.slug}</div>
              <div className="text-xs text-zinc-500">
                Created {new Date(room.createdAt).toLocaleString()} •{" "}
                {room.memberCount} members
              </div>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm" onClick={() =>
                  router.push(`/canvas/${room.id}?token=${token}`)
                }>Open </button>
              <button className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600" onClick={() => handleDelete(room.id)}> Delete </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
