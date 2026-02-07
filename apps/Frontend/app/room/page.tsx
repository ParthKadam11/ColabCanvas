"use client";
import { HTTP_BACKEND } from "@/config";
import { Input } from "@repo/ui";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RoomItem = {
  id: number;
  slug: string;
  createdAt: string;
  memberCount: number;
};

export default function RoomDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createName, setCreateName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("token");
    setToken(stored);
  }, []);

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
  }, [token]);

  const handleCreate = async () => {
    if (!token || !createName.trim()) return;
    try {
      await axios.post(
        `${HTTP_BACKEND}/room`,
        { roomname: createName.trim() },
        { headers: { authorization: token } },
      );
      setCreateName("");
      await loadRooms(token);
    } catch (e) {
      setError("Failed to create room");
      console.log(e);
    }
  };

  const handleJoin = async () => {
    if (!token || !joinName.trim()) return;
    try {
      const response = await axios.post(
        `${HTTP_BACKEND}/room/join`,
        { roomname: joinName.trim() },
        { headers: { authorization: token } },
      );
      const roomId = response.data?.roomId;
      if (roomId) {
        router.push(`/canvas/${roomId}?token=${token}`);
      }
    } catch (e) {
      setError("Failed to join room");
      console.log(e);
    }
  };

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

  if (!token) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800">
        <div className="min-w-md h-50 rounded-2xl bg-white text-black flex flex-col justify-center items-center gap-3 p-6">
          <div className="text-center">
            Please sign in to access your rooms.
          </div>
          <div className="w-40 rounded-2xl p-2 bg-black text-white flex items-center justify-center">
            <button onClick={()=>{redirect("/signin")}}>Signin</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-black dark:via-zinc-900 dark:to-zinc-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white">Rooms</h1>
          <p className="text-sm text-white">
            Create, join, or manage your rooms.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 text-black">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-medium">Create room</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                className="focus:outline-none border-0"
                id="create-room"
                name="create-room"
                placeholder="room name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
              />
              <button
                className="rounded-lg bg-black px-4 py-2 text-white w-full sm:w-auto"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-lg font-medium">Join room</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                className="focus:outline-none border-0"
                id="join-room"
                name="join-room"
                placeholder="room name"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
              />
              <button
                className="rounded-lg bg-black px-4 py-2 text-white w-full sm:w-auto"
                onClick={handleJoin}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="mt-8 rounded-xl bg-white p-5 shadow-sm text-black">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Your rooms</h2>
            {loading && (
              <span className="text-sm text-zinc-500">Loading...</span>
            )}
          </div>

          {!loading && rooms.length === 0 && (
            <div className="text-sm">No rooms yet.</div>
          )}

          <div className="space-y-3">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between shadow-sm rounded-lg border border-zinc-200 px-4 py-3"
              >
                <div>
                  <div className="font-medium">{room.slug}</div>
                  <div className="text-xs text-zinc-500">
                    Created {new Date(room.createdAt).toLocaleString()} •{" "}
                    {room.memberCount} members
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm"
                    onClick={() =>
                      router.push(`/canvas/${room.id}?token=${token}`)
                    }
                  >
                    Open
                  </button>
                  <button
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600"
                    onClick={() => handleDelete(room.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
