"use client";
import { HTTP_BACKEND } from "@/config";
import { Input } from "@repo/ui";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type JoinRoomProps = {
  token: string | null;
};

export function JoinRoom({ token }: JoinRoomProps) {
  const [joinName, setJoinName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      setError(null);
    } catch (e) {
      setError("Failed to join room");
      console.log(e);
    }
  };

  return (
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
          className="rounded-lg bg-slate-900 px-4 py-2 text-white w-full sm:w-auto"
          onClick={handleJoin}
        >
          Join
        </button>
      </div>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}
